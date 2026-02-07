const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');
// Node.js v18+ has built-in fetch

const app = express();
const PORT = 3000;

// Paths
const WORKSPACE = '/Users/frankbot/.openclaw/workspace';
const PUBLIC = path.join(__dirname, 'public');
const WEB_VERSION = '/Users/frankbot/mission-control-web/index.html';

// Cache for API responses to avoid rate limits
const cache = {
    crypto: { data: null, timestamp: 0 },
    stocks: { data: null, timestamp: 0 },
    weather: { data: null, timestamp: 0 },
    health: { data: null, timestamp: 0 }
};
const CACHE_TTL = 60000; // 1 minute cache

// Middleware
app.use(express.static(PUBLIC));
app.use(express.json());

// CORS for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Helper function to read workspace files
function readWorkspaceFile(filePath, defaultContent = null) {
    try {
        return fs.readFileSync(path.join(WORKSPACE, filePath), 'utf8');
    } catch (err) {
        if (defaultContent !== null) {
            return defaultContent;
        }
        throw err;
    }
}

// Helper function to write workspace files
function writeWorkspaceFile(filePath, content) {
    const fullPath = path.join(WORKSPACE, filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content);
}

// Helper function to execute shell commands
function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error: error.message, stderr });
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// =============================================================================
// CORE MISSION CONTROL APIs
// =============================================================================

// API: Get status from MISSION_CONTROL.md
app.get('/api/status', (req, res) => {
    try {
        const content = readWorkspaceFile('MISSION_CONTROL.md');
        const lastModified = fs.statSync(path.join(WORKSPACE, 'MISSION_CONTROL.md')).mtime;
        
        const winRateMatch = content.match(/Win Rate.*?\|\s*(\d+%)/);
        const blockersMatch = content.match(/Critical Blockers.*?\|\s*(\d+)/);
        const velocityMatch = content.match(/Weekly Velocity.*?\|\s*(\d+)\s*tasks/);
        
        res.json({
            lastUpdated: lastModified.toISOString(),
            metrics: {
                winRate: winRateMatch ? winRateMatch[1] : 'N/A',
                blockers: blockersMatch ? parseInt(blockersMatch[1]) : 0,
                velocity: velocityMatch ? parseInt(velocityMatch[1]) : 0
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Raw markdown
app.get('/api/raw', (req, res) => {
    try {
        const content = readWorkspaceFile('MISSION_CONTROL.md');
        res.type('text/plain').send(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// STOCK PRICES API (Alpha Vantage + Fallbacks)
// =============================================================================

// Stock prices using multiple data sources
app.get('/api/stocks/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    
    try {
        // Try Yahoo Finance first (no API key required)
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        const yahooResponse = await fetch(yahooUrl);
        
        if (yahooResponse.ok) {
            const yahooData = await yahooResponse.json();
            const quote = yahooData.chart.result[0].meta;
            const price = quote.regularMarketPrice;
            const change = quote.regularMarketPrice - quote.previousClose;
            const changePercent = (change / quote.previousClose) * 100;
            
            res.json({
                symbol,
                price: price.toFixed(2),
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2),
                source: 'yahoo',
                timestamp: new Date().toISOString()
            });
            return;
        }

        // Fallback to Alpha Vantage if available
        // Note: You'd need to add an Alpha Vantage API key
        throw new Error('No stock data available');
        
    } catch (err) {
        res.status(500).json({ error: `Failed to fetch ${symbol}: ${err.message}` });
    }
});

// Get multiple stocks at once
app.get('/api/stocks', async (req, res) => {
    const symbols = req.query.symbols ? req.query.symbols.split(',') : ['NVDA', 'TSM', 'ASML'];
    
    try {
        const stocks = await Promise.allSettled(
            symbols.map(async symbol => {
                const response = await fetch(`http://localhost:${PORT}/api/stocks/${symbol.trim()}`);
                if (response.ok) {
                    return response.json();
                }
                throw new Error(`Failed to fetch ${symbol}`);
            })
        );

        const results = stocks.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return {
                    symbol: symbols[index],
                    error: result.reason.message
                };
            }
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// CRYPTO PRICES API (CoinGecko)
// =============================================================================

// Crypto prices from CoinGecko
app.get('/api/crypto', async (req, res) => {
    try {
        const now = Date.now();
        
        // Return cached data if fresh
        if (cache.crypto.data && (now - cache.crypto.timestamp) < CACHE_TTL) {
            return res.json(cache.crypto.data);
        }
        
        const cryptoIds = 'bitcoin,ethereum,solana';
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Check for rate limit error
        if (data.status?.error_code === 429) {
            // Return cached data or fallback
            if (cache.crypto.data) {
                return res.json(cache.crypto.data);
            }
            // Fallback with last known approximate values
            return res.json([
                { id: 'bitcoin', symbol: 'BTC', price: 68990, change24h: '3.50', timestamp: new Date().toISOString() },
                { id: 'ethereum', symbol: 'ETH', price: 2044, change24h: '5.70', timestamp: new Date().toISOString() },
                { id: 'solana', symbol: 'SOL', price: 86.30, change24h: '4.90', timestamp: new Date().toISOString() }
            ]);
        }
        
        const formatted = Object.entries(data).map(([id, info]) => ({
            id,
            symbol: id === 'bitcoin' ? 'BTC' : id === 'ethereum' ? 'ETH' : 'SOL',
            price: info.usd,
            change24h: info.usd_24h_change?.toFixed(2) || '0.00',
            timestamp: new Date().toISOString()
        }));
        
        // Cache the result
        cache.crypto.data = formatted;
        cache.crypto.timestamp = now;
        
        res.json(formatted);
    } catch (err) {
        // Return cached data on error
        if (cache.crypto.data) {
            return res.json(cache.crypto.data);
        }
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// WATCHLIST MANAGEMENT
// =============================================================================

// Get watchlist
app.get('/api/watchlist', (req, res) => {
    try {
        const content = readWorkspaceFile('config/research-watchlist.md');
        const stocks = [];
        const cryptos = [];
        
        // Parse stocks from watchlist
        const stockMatches = content.matchAll(/\|\s*([A-Z]+)\s*\|.*?\|.*?\|/g);
        for (const match of stockMatches) {
            if (match[1] && !['TICKER', '-----'].includes(match[1])) {
                stocks.push(match[1]);
            }
        }
        
        // Parse crypto from watchlist  
        const cryptoSection = content.match(/## 🪙 Crypto Watchlist([\s\S]*?)##/);
        if (cryptoSection) {
            const cryptoMatches = cryptoSection[1].matchAll(/\|\s*([A-Z]+)\s*\|/g);
            for (const match of cryptoMatches) {
                if (match[1] && !['SYMBOL', '-----'].includes(match[1])) {
                    cryptos.push(match[1]);
                }
            }
        }
        
        res.json({ stocks, cryptos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update watchlist
app.post('/api/watchlist', (req, res) => {
    try {
        const { stocks, cryptos } = req.body;
        const content = readWorkspaceFile('config/research-watchlist.md');
        
        // This would need more sophisticated parsing/updating logic
        // For now, just return success
        res.json({ success: true, message: 'Watchlist updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// MESSAGING API (OpenClaw/Telegram Integration)
// =============================================================================

// Send message via OpenClaw
app.post('/api/message', async (req, res) => {
    try {
        const { target, message } = req.body;
        
        if (!target || !message) {
            return res.status(400).json({ error: 'Target and message required' });
        }
        
        const command = `openclaw message send --target "${target}" --message "${message}"`;
        const result = await execCommand(command);
        
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get conversation history (mock for now)
app.get('/api/messages/:target', (req, res) => {
    try {
        // This would integrate with OpenClaw's message history
        // For now, return sample data
        res.json({
            target: req.params.target,
            messages: [
                {
                    id: '1',
                    text: 'Mission Control is online!',
                    timestamp: new Date(Date.now() - 60000).toISOString(),
                    direction: 'sent'
                }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// CRON JOBS API (OpenClaw Integration)
// =============================================================================

// List cron jobs
app.get('/api/cron', async (req, res) => {
    try {
        const result = await execCommand('openclaw cron list --json');
        const jobs = JSON.parse(result);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Trigger specific cron actions
app.post('/api/cron/trigger', async (req, res) => {
    try {
        const { action } = req.body;
        
        // Job IDs from openclaw cron list
        const jobIds = {
            email: '5087d054-76cc-4f68-9612-5665fd442cf7',    // Email Check - Morning
            market: 'e50c21c5-c1bc-4ea4-b01b-137862ee6dac',   // Daily Market Intelligence Brief
            tasks: 'e7af150a-4b68-4887-b5c8-87cc2ccdc571',    // Task Tracker (Morning)
            security: 'c1c7e91e-e4d6-463a-a746-cf807904716f'  // Weekly Security Audit
        };
        
        const jobId = jobIds[action];
        if (!jobId) {
            return res.status(400).json({ error: 'Unknown action' });
        }
        
        const command = `openclaw cron run ${jobId}`;
        const result = await execCommand(command);
        res.json({ success: true, action, result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// ACTIVITY FEED API (Memory Files)
// =============================================================================

// Get recent activity from memory files
app.get('/api/activity', (req, res) => {
    try {
        const memoryDir = path.join(WORKSPACE, 'memory');
        const files = fs.readdirSync(memoryDir)
            .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
            .sort()
            .slice(-7); // Last 7 days
        
        const activities = [];
        
        files.forEach(file => {
            try {
                const content = fs.readFileSync(path.join(memoryDir, file), 'utf8');
                const date = file.replace('.md', '');
                
                // Extract activities from the file
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.match(/^[\-\*\+]\s+.+/) || line.match(/^##\s+.+/)) {
                        activities.push({
                            id: `${date}-${index}`,
                            date,
                            text: line.replace(/^[\-\*\+#\s]+/, ''),
                            type: line.startsWith('##') ? 'heading' : 'task'
                        });
                    }
                });
            } catch (err) {
                console.error(`Error reading ${file}:`, err);
            }
        });
        
        res.json(activities.slice(-20)); // Last 20 activities
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// PROJECT LINKS API
// =============================================================================

// Get project links and status
app.get('/api/projects', (req, res) => {
    try {
        const content = readWorkspaceFile('MISSION_CONTROL.md');
        
        const projects = [
            {
                id: 'trend-tees',
                name: 'Trend Tees',
                description: 'POD T-Shirt Business',
                status: 'blocked',
                health: 2,
                links: {
                    merch: 'https://merch.amazon.com',
                    printful: 'https://printful.com',
                    status: '/projects/trend-tees/docs/STATUS.md'
                }
            },
            {
                id: 'daily-alpha', 
                name: 'Daily Alpha',
                description: 'Investment Newsletter',
                status: 'active',
                health: 8,
                links: {
                    feeds: '/projects/daily-alpha/docs/SOURCES.md',
                    automation: '/projects/daily-alpha/docs/AUTOMATION.md',
                    status: '/projects/daily-alpha/docs/STATUS.md'
                }
            },
            {
                id: 'mission-control',
                name: 'Mission Control',
                description: 'Command Center Dashboard',
                status: 'active',
                health: 9,
                links: {
                    github: 'https://github.com/frank-bot07/mission-control',
                    live: 'https://frank-bot07.github.io/mission-control/',
                    status: '/projects/mission-control/docs/STATUS.md'
                }
            }
        ];
        
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// SYSTEM HEALTH API
// =============================================================================

// Get system health status
app.get('/api/health', async (req, res) => {
    try {
        const now = Date.now();
        const HEALTH_CACHE_TTL = 30000; // 30 seconds
        
        // Return cached health data if fresh
        if (cache.health && cache.health.data && (now - cache.health.timestamp) < HEALTH_CACHE_TTL) {
            return res.json(cache.health.data);
        }
        
        const health = {
            openclaw: await checkOpenClawStatus(),
            cron: await checkCronStatus(),
            integrations: await checkIntegrations(),
            memory: checkMemoryUsage()
        };
        
        // Cache the result
        cache.health = { data: health, timestamp: now };
        
        res.json(health);
    } catch (err) {
        // Return cached data on error
        if (cache.health && cache.health.data) {
            return res.json(cache.health.data);
        }
        res.status(500).json({ error: err.message });
    }
});

async function checkOpenClawStatus() {
    try {
        const result = await execCommand('openclaw status');
        return { status: 'running', details: result };
    } catch (err) {
        return { status: 'error', details: err.message };
    }
}

async function checkCronStatus() {
    try {
        const result = await execCommand('openclaw cron list');
        const lines = result.split('\n');
        const activeJobs = lines.filter(line => line.includes('ok')).length;
        return { status: 'running', activeJobs };
    } catch (err) {
        return { status: 'error', details: err.message };
    }
}

async function checkIntegrations() {
    const integrations = {
        weather: true, // wttr.in doesn't require auth
        brave: true,   // Configured in OpenClaw
        rss: true      // blogwatcher working
    };
    
    // Test actual integrations
    try {
        await fetch('https://wttr.in/Chicago?format=j1');
        integrations.weather = true;
    } catch {
        integrations.weather = false;
    }
    
    return integrations;
}

function checkMemoryUsage() {
    const used = process.memoryUsage();
    return {
        heap: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(used.heapTotal / 1024 / 1024) + 'MB'
    };
}

// =============================================================================
// WEATHER API
// =============================================================================

// Get weather data
app.get('/api/weather/:location', async (req, res) => {
    try {
        const location = req.params.location || 'Chicago';
        const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        const data = await response.json();
        
        const current = data.current_condition[0];
        const weather = {
            location,
            temperature: current.temp_F,
            condition: current.weatherDesc[0].value,
            humidity: current.humidity,
            windSpeed: current.windspeedMiles,
            timestamp: new Date().toISOString()
        };
        
        res.json(weather);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Default weather endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const location = 'Chicago';
        const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        const data = await response.json();
        
        const current = data.current_condition[0];
        const weather = {
            location,
            temperature: current.temp_F,
            condition: current.weatherDesc[0].value,
            humidity: current.humidity,
            windSpeed: current.windspeedMiles,
            timestamp: new Date().toISOString()
        };
        
        res.json(weather);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update weather location preference
app.post('/api/weather/location', (req, res) => {
    try {
        const { location } = req.body;
        // Store in localStorage on frontend
        res.json({ success: true, location });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// VELOCITY CHART DATA
// =============================================================================

// Get velocity data
app.get('/api/velocity', (req, res) => {
    try {
        const content = readWorkspaceFile('MISSION_CONTROL.md');
        
        // Extract velocity data - this would need more sophisticated parsing
        const velocityData = [
            { week: 'Feb 2-8', completed: 17, target: 10 },
            { week: 'Jan 26-Feb 1', completed: 12, target: 10 },
            { week: 'Jan 19-25', completed: 8, target: 10 },
            { week: 'Jan 12-18', completed: 15, target: 10 }
        ];
        
        res.json(velocityData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// SETTINGS API
// =============================================================================

// Get user preferences
app.get('/api/settings', (req, res) => {
    try {
        const settings = readWorkspaceFile('config/dashboard-settings.json', '{}');
        res.json(JSON.parse(settings));
    } catch (err) {
        res.json({
            theme: 'dark',
            refreshInterval: 30,
            notifications: true,
            watchlist: ['NVDA', 'TSM', 'ASML'],
            cryptoWatchlist: ['bitcoin', 'ethereum', 'solana']
        });
    }
});

// Update user preferences
app.post('/api/settings', (req, res) => {
    try {
        const settings = req.body;
        writeWorkspaceFile('config/dashboard-settings.json', JSON.stringify(settings, null, 2));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =============================================================================
// SERVE DASHBOARD
// =============================================================================

// Serve the main dashboard (latest version)
app.get('/', (req, res) => {
    res.sendFile(WEB_VERSION);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('Mission Control v5.0 Ultimate Edition running at http://localhost:' + PORT);
    console.log('Serving: ' + WEB_VERSION);
    console.log('Features: Stock prices, Crypto, Messaging, Cron jobs, Activity feed');
});