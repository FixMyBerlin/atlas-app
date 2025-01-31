// This function gets called on every server startup.
// For details see `/src/instrumentation/README.md`
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerSQLFunctions } = await import('./instrumentation/registerSQLFunctions')
    registerSQLFunctions()

    const { cacheRadinfraDeCampaigns } = await import('./instrumentation/cacheRadinfraDeCampaigns')
    cacheRadinfraDeCampaigns()
  }
}
