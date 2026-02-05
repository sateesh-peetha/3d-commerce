/**
 * Express Server - Minimal runnable app with installer mode
 * 
 * Tech choices:
 * - Storage: Local JSON file (no database)
 * - Auth: Simple session-based email login
 * - No external dependencies beyond express
 */
const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Simple session storage (in-memory for simplicity)
const sessions = new Map();

/**
 * API: Get system status
 * Returns whether app is installed and in what mode
 */
app.get('/api/status', (req, res) => {
    const installed = config.isInstalled();
    const currentConfig = installed ? config.readConfig() : null;

    res.json({
        installed,
        mode: installed ? 'DASHBOARD' : 'INSTALLER',
        adminEmail: currentConfig?.adminEmail || null,
        installedAt: currentConfig?.installedAt || null
    });
});

/**
 * API: Complete setup
 * Saves configuration and exits installer mode
 */
app.post('/api/setup', (req, res) => {
    const { adminEmail, usageContext } = req.body;

    // Validation
    if (!adminEmail || !adminEmail.includes('@')) {
        return res.status(400).json({
            error: 'Please enter a valid email address'
        });
    }

    // Save config
    const success = config.writeConfig({
        adminEmail,
        usageContext: usageContext || 'personal',
        loginMethod: 'email' // Documented choice: email-based auth
    });

    if (success) {
        // Create session for admin
        const sessionId = generateSessionId();
        sessions.set(sessionId, { email: adminEmail, createdAt: Date.now() });

        res.json({
            success: true,
            message: 'Setup complete!',
            sessionId
        });
    } else {
        res.status(500).json({
            error: 'Failed to save configuration. Please try again.'
        });
    }
});

/**
 * API: Admin login
 */
app.post('/api/login', (req, res) => {
    const { email } = req.body;
    const currentConfig = config.readConfig();

    if (!currentConfig) {
        return res.status(400).json({ error: 'System not configured' });
    }

    if (email === currentConfig.adminEmail) {
        const sessionId = generateSessionId();
        sessions.set(sessionId, { email, createdAt: Date.now() });
        res.json({ success: true, sessionId });
    } else {
        res.status(401).json({ error: 'Invalid admin email' });
    }
});

/**
 * API: Verify session
 */
app.get('/api/session', (req, res) => {
    const sessionId = req.headers['x-session-id'];

    if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId);
        res.json({ valid: true, email: session.email });
    } else {
        res.json({ valid: false });
    }
});

/**
 * API: Reset to installer mode
 */
app.post('/api/reset', (req, res) => {
    const success = config.resetConfig();
    sessions.clear();

    if (success) {
        res.json({ success: true, message: 'Reset complete. Refresh to re-run setup.' });
    } else {
        res.status(500).json({ error: 'Failed to reset' });
    }
});

/**
 * Serve React app for all other routes
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

/**
 * Generate simple session ID
 */
function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Start server
app.listen(PORT, () => {
    const status = config.isInstalled() ? 'Dashboard mode' : 'Installer mode';
    console.log(`
╔════════════════════════════════════════╗
║   3D Commerce App                      ║
║   Running on http://localhost:${PORT}      ║
║   Status: ${status.padEnd(27)}║
╚════════════════════════════════════════╝
    `);
});
