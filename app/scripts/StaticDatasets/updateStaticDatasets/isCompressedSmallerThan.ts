import fs from 'node:fs'
import pako from 'pako'

export async function isCompressedSmallerThan(filePath: string, maxCompressedSize: number) {
  const uncompressedSize = fs.statSync(filePath).size
  if (uncompressedSize > 30 * maxCompressedSize) return false
  const compressedSize = pako.gzip(fs.readFileSync(filePath)).length
  return compressedSize <= maxCompressedSize
}
