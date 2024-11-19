import { PrismaClient } from '@prisma/client'
import { $ } from 'bun'
import chalk from 'chalk'
import type { Topic } from '../constants/topics.const'

const backupTableIdentifier = (table: string) => `backup."${table}"`
const diffTableIdentifier = (table: string) => `public."${table}_diff"`
const tableIdentifier = (table: string) => `public."${table}"`
export async function getTopicTables(topic: Topic) {
  try {
    const tables = await $`lua /processing/utils/TableNames.lua ${topic}`
      .text()
      .then((tables) => new Set(tables.split('\n').filter((table) => table !== '')))
    return tables
  } catch {
    throw new Error(
      `Failed to get tables for topic ${topic}. This is likely due to some required columns missing.`,
    )
  }
}

const prisma = new PrismaClient()

export async function createBackupSchema() {
  prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS backup`
}
/**
 * Get all table names from the given schema.
 * @param schema
 * @returns a set of table names
 */
export async function getSchemaTables(schema: string) {
  const rows: { table_name: string }[] = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = ${schema}
    AND table_type = 'BASE TABLE';`
  return new Set(rows.map(({ table_name }) => table_name))
}

/**
 * Backup the given table by copying it to the `backup` schema.
 * @param table
 * @returns the Promise of the query
 */
export async function backupTable(table: string) {
  const tableId = tableIdentifier(table)
  const backupTableId = backupTableIdentifier(table)
  await prisma.$queryRawUnsafe(`DROP TABLE IF EXISTS ${backupTableId}`)
  return prisma.$queryRawUnsafe(`CREATE TABLE ${backupTableId} AS TABLE ${tableId}`)
}

export async function dropDiffTable(table: string) {
  const diffTableId = diffTableIdentifier(table)
  return prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${diffTableId}`)
}

/**
 * Create a spatial index on the given table's `geom` column.
 * @param table
 * @returns the Promise of the query
 */
async function createSpatialIndex(table: string) {
  const tableId = diffTableIdentifier(table)
  return prisma.$executeRawUnsafe(`CREATE INDEX ON ${tableId} USING GIST(geom)`)
}

/**
 * Diff the given table with the backup table and store the result in the `table_diff` table.
 * @param table
 * @returns the number of added, removed and modified entries
 */
export async function computeDiff(table: string) {
  const tableId = tableIdentifier(table)
  const backupTableId = backupTableIdentifier(table)
  const diffTableId = diffTableIdentifier(table)
  const joinedTableId = `backup."${table}_joined"`
  const changeTypes = {
    added: `'{"CHANGE": "added"}'`,
    removed: `'{"CHANGE": "removed"}'`,
    modified: `'{"CHANGE": "modified"}'`,
  }

  // compute full outer join
  await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${joinedTableId}`)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE ${joinedTableId} AS
    SELECT
      ${tableId}.tags AS new_tags,
      ${tableId}.id AS new_id,
      ${tableId}.meta AS new_meta,
      ${tableId}.geom AS new_geom,
      ${backupTableId}.tags AS old_tags,
      ${backupTableId}.id AS old_id,
      ${backupTableId}.meta AS old_meta,
      ${backupTableId}.geom AS old_geom
    FROM ${backupTableId}
    FULL OUTER JOIN ${tableId} ON ${backupTableId}.id = ${tableId}.id`)

  // create the diff table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE ${diffTableId} AS
    SELECT id, tags, meta, geom FROM ${tableId}
    WITH NO DATA`)

  // compute diff
  const modifiedPromise: Promise<number> = prisma.$executeRawUnsafe(`
    INSERT INTO ${diffTableId} (id, tags, meta, geom)
    SELECT
      new_id AS id,
      jsonb_diff(old_tags, new_tags) || ${changeTypes.modified} AS tags,
      new_meta AS meta,
      new_geom AS geom
      FROM ${joinedTableId}
      WHERE new_id IS NOT NULL AND old_id IS NOT NULL AND old_tags <> new_tags`)

  const addedPromise: Promise<number> = prisma.$executeRawUnsafe(`
    INSERT INTO ${diffTableId} (id, tags, meta, geom)
    SELECT
      new_id AS id,
      new_tags || ${changeTypes.added} AS tags,
      new_meta AS meta,
      new_geom AS geom
    FROM ${joinedTableId}
    WHERE old_id IS NULL;`)

  const removedPromise: Promise<number> = prisma.$executeRawUnsafe(`
    INSERT INTO ${diffTableId} (id, tags, meta, geom)
    SELECT
      old_id AS id,
      old_tags || ${changeTypes.removed} AS tags,
      old_meta AS meta,
      old_geom AS geom
    FROM ${joinedTableId}
    WHERE new_id IS NULL`)

  return Promise.all([modifiedPromise, addedPromise, removedPromise]).then(
    async ([nModified, nAdded, nRemoved]) => {
      const nTotal = nModified + nAdded + nRemoved
      if (nTotal === 0) {
        await dropDiffTable(table)
      } else {
        createSpatialIndex(table)
      }
      await prisma.$executeRawUnsafe(`DROP TABLE ${joinedTableId}`)
      return {
        table,
        nTotal,
        nModified,
        nAdded,
        nRemoved,
      }
    },
  )
}

function printDiffInfo(diffInfo: Awaited<ReturnType<typeof computeDiff>>) {
  const { table } = diffInfo
  console.log(`🔍 Diffing table "${table}":`)
  const loggingStyle = [
    { name: 'total:', color: chalk.yellow, key: 'nTotal' as const },
    { name: 'added:', color: chalk.green, key: 'nAdded' as const },
    { name: 'removed:', color: chalk.red, key: 'nRemoved' as const },
    { name: 'modified:', color: chalk.blue, key: 'nModified' as const },
  ]
  const indent = ' '.repeat(5)
  loggingStyle.forEach(({ name, color, key }) => {
    console.log(`${indent}${name.padEnd(10)}${color(diffInfo[key])}`)
  })
}

/**
 * Diff the given tables and print the results.
 * @param tables
 */
export async function diffTables(tables: string[]) {
  // compute all diffs in parallel
  const diffResults = await Promise.all(tables.map((table) => computeDiff(table)))

  // print the results for each table that changed
  diffResults.filter(({ nTotal }) => nTotal > 0).map(printDiffInfo)
}
