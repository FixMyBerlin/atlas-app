// This function gets called on every server startup. For details see /src/registerSQLFunctions/README.md or https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerSQLFunctions } = await import('./registerSQLFunctions/registerSQLFunctions')
    return registerSQLFunctions()
  }
}
