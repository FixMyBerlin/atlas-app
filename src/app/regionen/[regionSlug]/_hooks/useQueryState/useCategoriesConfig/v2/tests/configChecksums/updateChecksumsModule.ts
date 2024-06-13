#!/usr/bin/env bun

// This script generates the module "checksums.ts"
// Run `npm run format` after the file was generated

import path from 'path'
import { generateChecksums } from './generateChecksums'

const moduleName = 'checksums'
const checksums = generateChecksums()
const code = `export const ${moduleName} = ${JSON.stringify(checksums)}`
const modulePath = path.join(import.meta.dir, `${moduleName}.ts`)

Bun.write(modulePath, code)
console.log('Updated', modulePath)
