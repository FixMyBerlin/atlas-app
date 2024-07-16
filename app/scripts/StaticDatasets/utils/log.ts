import chalk from 'chalk'

export const yellow = (s: string) => console.log(chalk.yellow(s))
export const green = (s: string) => console.log(chalk.green(s))
export const red = (s: string, ...rest: any[]) => console.log(chalk.red(s), ...rest)
export const inverse = (s: string, ...rest: any[]) => console.log(chalk.inverse(s), ...rest)
