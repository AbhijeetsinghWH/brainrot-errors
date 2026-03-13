const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.config', 'brainrot-errors');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function getConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { sound: 'random', volume: 1 };
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (err) {
    return { sound: 'random', volume: 1 };
  }
}

function setConfig(newConfig) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const config = getConfig();
    const updated = { ...config, ...newConfig };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
    return true;
  } catch (err) {
    return false;
  }
}

function getConfigPath() {
  return CONFIG_DIR;
}

function ensureSoundDir() {
  const soundDir = path.join(CONFIG_DIR, 'sounds');
  if (!fs.existsSync(soundDir)) {
    fs.mkdirSync(soundDir, { recursive: true });
  }
  return soundDir;
}

module.exports = { getConfig, setConfig, getConfigPath, ensureSoundDir, CONFIG_DIR };