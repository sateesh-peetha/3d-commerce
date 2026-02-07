/**
 * Config Module - Read/Write configuration to JSON file
 * Storage: Local JSON file (simplest approach, no database needed)
 */
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'data', 'config.json');

/**
 * Check if the app has been installed
 */
function isInstalled() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return false;
        }
        const config = readConfig();
        return !!(config && config.installed === true && config.adminEmail);
    } catch (error) {
        return false;
    }
}

/**
 * Read configuration from file
 */
function readConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            return null;
        }
        const data = fs.readFileSync(CONFIG_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading config:', error.message);
        return null;
    }
}

/**
 * Write configuration to file
 */
function writeConfig(config) {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(CONFIG_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Add metadata
        const configWithMeta = {
            ...config,
            installed: true,
            installedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(configWithMeta, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing config:', error.message);
        return false;
    }
}

/**
 * Reset configuration (for re-run setup)
 */
function resetConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            fs.unlinkSync(CONFIG_PATH);
        }
        return true;
    } catch (error) {
        console.error('Error resetting config:', error.message);
        return false;
    }
}

module.exports = {
    isInstalled,
    readConfig,
    writeConfig,
    resetConfig
};
