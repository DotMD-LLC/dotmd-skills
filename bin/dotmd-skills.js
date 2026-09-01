#!/usr/bin/env node

import { formatCliError, runCli } from '../lib/cli.js';

process.on('SIGINT', () => {
  console.error('\nInstallation cancelled.');
  process.exit(130);
});

try {
  process.exitCode = await runCli(process.argv.slice(2));
} catch (error) {
  const formatted = formatCliError(error);
  console.error(formatted.message);
  process.exitCode = formatted.exitCode;
}
