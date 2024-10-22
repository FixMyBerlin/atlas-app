import { registerSQLFunctions } from './registerSQLFunctions/registerSQLFunctions'
// This function gets called on every server startup. For details see /src/registerSQLFunctions/README.md
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    registerSQLFunctions()
  }
}
