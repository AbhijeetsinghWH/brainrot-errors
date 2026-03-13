# brainrot-errors

<p align="center">
  <img src="https://img.shields.io/npm/v/brainrot-errors?style=flat" alt="npm version">
  <img src="https://img.shields.io/npm/dt/brainrot-errors" alt="npm downloads">
</p>

Plays a sound whenever a terminal command outputs an error. Because why stare at your terminal when you can HEAR your failures? 🎵

## Installation

```bash
npm install -g brainrot-errors
```

Or use without installing:

```bash
npx brainrot-errors <command>
```

## Quick Start

```bash
# Wrap any command - plays sound on error
brainrot tsc --watch
brainrot next dev
brainrot npm run build

# Show help
brainrot --help
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `brainrot <command>` | Run any command and watch for errors |
| `brainrot --sounds` | List available sound files |
| `brainrot --set-sound <filename>` | Set which sound plays on error |
| `brainrot --config` | Show config directory path |
| `brainrot --uninstall` | Show clean uninstall instructions |
| `brainrot --help` | Show help message |

## Examples

### TypeScript Watch Mode
```bash
brainrot tsc --watch
# Plays sound when TypeScript errors occur
```

### Next.js Development
```bash
brainrot next dev
# Plays sound on build errors
```

### npm scripts
```bash
brainrot npm run build
brainrot npm run dev
```

### Python
```bash
brainrot python main.py
# Plays sound on Python exceptions/tracebacks
```

### Rust
```bash
brainrot cargo build
# Plays sound on Rust compile errors
```

## Sound Files

### Where to put sounds

1. **User custom sounds** (recommended):
   ```
   ~/.config/brainrot-errors/sounds/
   ```

2. **Bundled sounds** (in package):
   ```
   ./sounds/
   ```

### Supported formats
- `.mp3`
- `.wav`

### Sound selection modes

- `random` - plays a random sound from available files (default)
- Specific filename - plays that exact file

```bash
# Set to random (default)
brainrot --set-sound random

# Set to specific sound
brainrot --set-sound explosion.wav
```

### Adding sounds

```bash
# Create sounds directory
mkdir -p ~/.config/brainrot-errors/sounds

# Copy your sound files there
cp mysound.mp3 ~/.config/brainrot-errors/sounds/

# List available sounds
brainrot --sounds
```

## Error Detection

The package detects errors from:

- **TypeScript**: `error TS2345:`, `error TS2304:`, etc.
- **Next.js/Vite/webpack**: Build failures, compilation errors
- **Node.js**: TypeError, ReferenceError, SyntaxError, etc.
- **Python**: Tracebacks, exceptions
- **Rust**: Compile errors
- **Go**: Compile errors
- **General**: "error:", "failed", "build failed", "cannot find module"

### Ignored patterns (false positives)

- "0 errors"
- "compiled successfully"
- "no errors"
- "errorHandler" (variable names)

## Configuration

Config is stored at: `~/.config/brainrot-errors/config.json`

```json
{
  "sound": "random",
  "volume": 1
}
```

### Volume control

Edit the config file directly to adjust volume (0.0 to 1.0):

```json
{
  "sound": "random",
  "volume": 0.5
}
```

## Clean Uninstall

```bash
# Remove the global package
npm uninstall -g brainrot-errors

# Remove config and custom sounds
rm -rf ~/.config/brainrot-errors
```

That's it! Nothing else is left behind.

## How it works

1. Wraps your command and runs it
2. Watches both stdout and stderr for error patterns
3. Plays a sound file when an error is detected
4. Falls back to terminal bell (`\x07`) if no sound file found

## License

MIT