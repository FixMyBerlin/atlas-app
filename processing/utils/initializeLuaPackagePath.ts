import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { isDev } from './isDev'

export const initializeLuaPackagePath = async () => {
  const rootDir = './'
  // Default package.path is "/usr/local/share/lua/5.3/?.lua;/usr/local/share/lua/5.3/?/init.lua;/usr/local/lib/lua/5.3/?.lua;/usr/local/lib/lua/5.3/?/init.lua;/usr/share/lua/5.3/?.lua;/usr/share/lua/5.3/?/init.lua;./?.lua;./?/init.lua"
  // Which means in order to just `require('init')` we need to put the file into `./processing/init.lua`
  const resultFile = join(import.meta.dir, '../init.lua')
  const seen = new Set<string>()

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.lua')) {
        seen.add(relative('.', dir).replaceAll('\\', '/')) // Normalize for Windows too
      }
    }
  }

  await walk(rootDir)

  const pathEntries = Array.from(seen)
    .filter((p) => !p.includes('__tests__'))
    .map((p) => `/processing/${p}/?.lua`)
    .join(';')

  const luaCode = `-- Auto-generated using processing/utils/initializeLuaPackagePath.ts
-- Runs on every processing run.
-- Extends the package.path to include all folders that have a .lua file (except for '__test__' folders).
-- We import this file via \`require('init')\` in every lua file.
package.path = package.path .. ";${pathEntries}"

-- print('Known package path from \`init.lua\`: ' .. package.path) -- Use for temp debugging only because it breaks our \`writeTodoIdTypes\` helper because this print is added to that resuls "array".
`

  await Bun.write(resultFile, luaCode)
  console.log(
    'Processing: `init.lua`s `package.path` was updated',
    isDev ? { pathEntries, resultFile } : '',
  )
}
