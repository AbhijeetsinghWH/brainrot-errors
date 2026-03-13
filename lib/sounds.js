const fs = require('fs');
const path = require('path');
const os = require('os');
const { getConfig, getConfigPath } = require('./config');

const BUNDLED_SOUNDS = path.join(__dirname, '..', 'sounds');
const USER_SOUNDS = path.join(os.homedir(), '.config', 'brainrot-errors', 'sounds');

let player = null;
try {
  player = require('play-sound');
} catch (err) {
  player = null;
}

function getSoundFiles(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ext === '.mp3' || ext === '.wav';
    }).map(f => path.join(dir, f));
  } catch (err) {
    return [];
  }
}

function getAllSounds() {
  const bundled = getSoundFiles(BUNDLED_SOUNDS);
  const user = getSoundFiles(USER_SOUNDS);
  return [...bundled, ...user];
}

function playSound(soundFile, volume = 1) {
  if (!player) {
    process.stdout.write('\x07');
    return;
  }

  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    const { spawn } = require('child_process');
    const vbs = `Set WshShell = CreateObject("WScript.Shell"):WshShell.Run """${soundFile.replace(/"/g, '""')}""", 0, False`;
    const tempVbs = path.join(os.tmpdir(), 'brainrotSound.vbs');
    try {
      fs.writeFileSync(tempVbs, vbs);
      spawn('cscript', ['//nologo', tempVbs], { detached: true, stdio: 'ignore' });
      setTimeout(() => { try { fs.unlinkSync(tempVbs); } catch(e) {} }, 3000);
      return;
    } catch (err) {
      process.stdout.write('\x07');
      return;
    }
  }

  try {
    const p = player.play(soundFile, { volume }, (err) => {
      if (err) {
        process.stdout.write('\x07');
      }
    });
  } catch (err) {
    process.stdout.write('\x07');
  }
}

function playRandomSound() {
  const sounds = getAllSounds();
  if (sounds.length === 0) {
    process.stdout.write('\x07');
    return;
  }
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
  const config = getConfig();
  playSound(randomSound, config.volume);
}

function playConfiguredSound() {
  const config = getConfig();
  const sounds = getAllSounds();

  if (sounds.length === 0) {
    process.stdout.write('\x07');
    return;
  }

  if (config.sound === 'random' || !config.sound) {
    playRandomSound();
    return;
  }

  const soundPath = path.join(USER_SOUNDS, config.sound);
  if (fs.existsSync(soundPath)) {
    playSound(soundPath, config.volume);
    return;
  }

  const bundledPath = path.join(BUNDLED_SOUNDS, config.sound);
  if (fs.existsSync(bundledPath)) {
    playSound(bundledPath, config.volume);
    return;
  }

  playRandomSound();
}

function listSounds() {
  const bundled = getSoundFiles(BUNDLED_SOUNDS).map(f => path.basename(f));
  const user = getSoundFiles(USER_SOUNDS).map(f => path.basename(f));
  return { bundled, user };
}

module.exports = { 
  playSound, 
  playRandomSound, 
  playConfiguredSound, 
  listSounds, 
  getAllSounds,
  USER_SOUNDS 
};