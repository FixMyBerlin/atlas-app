const { execSync } = require('child_process')

let output
try {
  output = execSync('npm run migrate:check').toString()
} catch (error) {
  output = error.stdout.toString()
}

if (output.includes('Following migration have not yet been applied')) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'There are pending migrations. Please run them with `npm run migrate` before starting the server.',
    '(This message is send to you by scripts/npm-run-predev/checkMigrations.js)',
  )

  process.exit(1)
}
