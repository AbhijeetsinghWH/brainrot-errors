const IGNORE_PATTERNS = [
  /errorHandler/i,
  /0 errors/i,
  /compiled successfully/i,
  /no errors/i,
  /0 error/i,
  /error_count[\s:=]+0/i,
];

const ERROR_PATTERNS = [
  { pattern: /error TS\d+:/, name: 'TypeScript' },
  { pattern: /TypeError:|ReferenceError:|SyntaxError:|RangeError:/, name: 'JavaScript Error' },
  { pattern: /Error:|Exception:|Traceback \(most recent call last\):/, name: 'Python' },
  { pattern: /error\[E\d+\]:|Build failed|Failed to build/, name: 'Next.js/Vite' },
  { pattern: /error:|ERROR:|Error:/, name: 'General', exclude: /errorHandler|error_count|0 error|no error/i },
  { pattern: /failed|FAILED/i, name: 'Failure', exclude: /failures|0 failed|failed:$/i },
  { pattern: /compilation failed|compilation error/i, name: 'Compilation' },
  { pattern: /^\s*\d+:\d+\s+error/, name: 'Compiler' },
  { pattern: /error CS\d+:/, name: 'C#' },
  { pattern: /error C\d+:/, name: 'C/C++' },
  { pattern: /error Rust/i, name: 'Rust' },
  { pattern: /cannot find module|Module not found|Cannot read property/, name: 'Module Error' },
  { pattern: /SyntaxError:|ParseError:|Unexpected token/, name: 'Syntax Error' },
  { pattern: /Connection refused|ECONNREFUSED/, name: 'Connection Error' },
  { pattern: /ENOENT|ENOTDIR|EACCES/, name: 'File System Error' },
];

function shouldIgnore(line) {
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(line)) return true;
  }
  return false;
}

function detectError(line) {
  if (shouldIgnore(line)) return null;

  for (const { pattern, name, exclude } of ERROR_PATTERNS) {
    if (pattern.test(line)) {
      if (exclude && exclude.test(line)) continue;
      return name;
    }
  }
  return null;
}

function hasError(output) {
  const lines = output.split('\n');
  for (const line of lines) {
    if (detectError(line)) return true;
  }
  return false;
}

module.exports = { detectError, hasError, shouldIgnore };