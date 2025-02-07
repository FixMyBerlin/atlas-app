import { PrismaClient } from '@prisma/client'
import { $ } from 'bun'
import { filteredFilePath } from './filter'

const prisma = new PrismaClient()

/**
 * Create the metadata table in the database. If already exists, does nothing.
 * @returns the Promise of the query
 */
export async function initializeMetadataTable() {
  return prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS public.meta (
      id SERIAL PRIMARY KEY,
      processed_at TIMESTAMP,
      processing_duration TIME,
      osm_data_from TIMESTAMP
    );`
}

/**
 * Get the timestamp from the given OSM file. Uses osmium fileinfo to get the timestamp.
 * @param fileName the file name to take the timestamp from
 * @returns the time stamp as a string
 */
export async function getFileTimestamp(fileName: string) {
  try {
    const timestamp =
      await $`osmium fileinfo ${filteredFilePath(fileName)} -g header.option.timestamp`.text()
    return timestamp.trim()
  } catch (error) {
    throw new Error(`Failed to get timestamp from file "${fileName}": ${error}`)
  }
}

/**
 * Write the runs metadata to the database.
 * @param fileName the file that was used in this run
 * @param processingDurationMS the time the processing took in milliseconds
 * @returns the Promise of the query
 */
export async function writeMetadata(fileName: string, processingDurationMS: number) {
  const filesTimestamp = new Date(await getFileTimestamp(fileName))
  const processingDate = new Date()
  const processingDuration = new Date(processingDurationMS)

  return prisma.$executeRaw`
    INSERT INTO public.meta
      (processed_at, processing_duration, osm_data_from)
      VALUES (${processingDate}, ${processingDuration}, ${filesTimestamp});`
}
