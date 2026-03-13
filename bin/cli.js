#!/usr/bin/env node

const { spawn } = require('child_process');
const minimist = require('minimist');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { getConfig, setConfig, getConfigPath, CONFIG_DIR, ensureSoundDir } = require('../lib/config');
const { listSounds, playConfiguredSound, USER_SOUNDS } = require('../lib/sounds');
const { hasError } = require('../lib/detect');

const args = process.argv.slice(2);
const parsed = minimist(args);

const HELP = `
brainrot-errors - Plays a sound when commands fail

Usage:
  brainrot <command>        Run command and watch for errors
  brainrot --sounds         List available sounds
  brainrot --set-sound <file> Set which sound plays on error
  brainrot --config         Show config directory path
  brainrot --uninstall      Print uninstall instructions
  brainrot --help           Show this help message

Examples:
  brainrot tsc --watch
  brainrot next dev
  brainrot --set-sound explosion.wav
  brainrot --sounds
`.trim();

if (args.length === 0) {
  console.log(HELP);
  process.exit(0);
}

if (parsed.help) {
  console.log(HELP);
  process.exit(0);
}

if (parsed.config) {
  console.log(CONFIG_DIR);
  process.exit(0);
}

if (parsed.sounds) {
  const { bundled, user } = listSounds();
  console.log(chalk.bold('Available sounds:'));
  if (bundled.length > 0) {
    console.log(chalk.cyan('\nBundled:'));
    bundled.forEach(s => console.log('  ' + s));
  }
  if (user.length > 0) {
    console.log(chalk.cyan('\nUser custom ( ~/.config/brainrot-errors/sounds/ ):'));
    user.forEach(s => console.log('  ' + s));
  }
  if (bundled.length === 0 && user.length === 0) {
    console.log(chalk.yellow('\nNo sound files found.'));
    console.log('Add .mp3 or .wav files to:');
    console.log('  ' + USER_SOUNDS);
  }
  process.exit(0);
}

if (parsed['set-sound']) {
  const soundFile = parsed['set-sound'];
  if (setConfig({ sound: soundFile })) {
    console.log(chalk.green(`Sound set to: ${soundFile}`));
  } else {
    console.log(chalk.red('Failed to save config'));
  }
  process.exit(0);
}

if (parsed.uninstall) {
  console.log(chalk.bold('Uninstall instructions:'));
  console.log('');
  console.log('1. Remove the global package:');
  console.log('   ' + chalk.cyan('npm uninstall -g brainrot-errors'));
  console.log('');
  console.log('2. Remove config and sounds:');
  console.log('   ' + chalk.cyan('rm -rf ~/.config/brainrot-errors'));
  console.log('');
  console.log('That\'s it! Nothing else is left behind.');
  process.exit(0);
}

const command = args.join(' ');
if (!command) {
  console.log(HELP);
  process.exit(0);
}

const child = spawn(command, {
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe']
});

let errorPlayed = false;

child.stdout.on('data', (data) => {
  process.stdout.write(data);
  if (!errorPlayed && hasError(data.toString())) {
    errorPlayed = true;
    playConfiguredSound();
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
  if (!errorPlayed && hasError(data.toString())) {
    errorPlayed = true;
    playConfiguredSound();
  }
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error(chalk.red('Failed to start command:'), err.message);
  process.exit(1);
});