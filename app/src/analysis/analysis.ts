import chalk from 'chalk'
import { aggregateLengths } from './aggregateLengths'

// This function gets called by the `private/post-processing-hook` endpoint
export async function analysis() {
  try {
    const startTime = Date.now()
    console.log(chalk.bold(chalk.white(' ○')), `Running Analysis`)

    const aggregateLengthsPromise = aggregateLengths()

    // collect promises and add a final log message
    const analysisPromise = Promise.all([aggregateLengthsPromise]).then(() => {
      const secondsElapsed = Math.round((Date.now() - startTime) / 100) / 10
      console.log(`${chalk.bold(chalk.green(' ✓'))} Analysis completed in ${secondsElapsed} s`)
    })
    return analysisPromise
  } catch (e) {
    console.error('\n\nANALYSIS FAILED', e)
  }
}
