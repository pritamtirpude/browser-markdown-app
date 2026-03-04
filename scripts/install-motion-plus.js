import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      process.env[key.trim()] = rest.join('=').trim();
    }
  } catch {
    // .env file not found, rely on system env vars
  }
}

loadEnv();

const token = process.env.MOTION_PLUS_TOKEN;
if (!token) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'ERROR: MOTION_PLUS_TOKEN not found. Create a .env file with your token (see .env.example).',
  );
  process.exit(1);
}

const url = `https://api.motion.dev/registry.tgz?package=motion-plus&version=2.6.1&token=${token}`;

console.log('Installing motion-plus...');
execSync(`npm install "${url}" --no-save`, { stdio: 'inherit' });
console.log('motion-plus installed successfully.');
