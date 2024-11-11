import { PrismaClient } from '@prisma/client'
import { $ } from 'bun'
import { filteredFile } from './filter'

const prisma = new PrismaClient()
export async function getFileTimestamp(fileName: string) {
  return $`osmium fileinfo ${filteredFile(fileName)} -g header.option.timestamp`.text()
}
export async function createMetadataTable() {
  return prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS public.meta
      (id SERIAL PRIMARY KEY, processed_at TIMESTAMP, processing_duration TIME, osm_data_from TIMESTAMP);`
}
export async function writeMetadata(fileName: string, processingDurationSeconds: number) {
  const filesTimestamp = await getFileTimestamp(fileName)
  const processingDate = new Date()
  const processingDuration = new Date(processingDurationSeconds * 1000)
  return prisma.$executeRaw`
    INSERT INTO public.meta
      (processed_at, processing_duration, osm_data_from)
      VALUES (${processingDate}, ${processingDuration}, ${filesTimestamp});`
}
