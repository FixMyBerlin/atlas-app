import { registerSQLFunctions } from './instrumentation/registerSQLFunctions'
// This function gets called on every server startup. For details see /src/instrumentation/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    registerSQLFunctions()
  }
}
