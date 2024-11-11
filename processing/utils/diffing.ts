import { PrismaClient } from '@prisma/client'
import { $ } from 'bun'
import type { Topic } from '../topics.const'

const backupTableIdentifier = (table: string) => `backup."${table}"`
const diffTableIdentifier = (table: string) => `public."${table}_diff"`
const tableIdentifier = (table: string) => `public."${table}"`
export async function getTopicTables(topic: Topic) {
  return $`lua /processing/utils/TableNames.lua ${topic}`
    .text()
    .then((tables) => tables.split('\n'))
}

const prisma = new PrismaClient()

export async function createBackupSchema() {
  prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS backup`
}
export async function getSchemaTables(schema: string) {
  const rows: { table_name: string }[] = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = ${schema}
    AND table_type = 'BASE TABLE';`
  return new Set(rows.map(({ table_name }) => table_name))
}
export async function backupTable(table: string) {
  const tableId = tableIdentifier(table)
  const backupTableId = backupTableIdentifier(table)
  await prisma.$queryRawUnsafe(`DROP TABLE IF EXISTS ${backupTableId}`)
  return prisma.$queryRawUnsafe(`CREATE TABLE ${backupTableId} AS TABLE ${tableId}`)
}

export async function dropDiffTable(table: string) {
  const diffTableId = diffTableIdentifier(table)
  return prisma.$executeRawUnsafe(`DROP TABLE ${diffTableId}`)
}

async function createSpatialIndex(table: string) {
  const tableId = diffTableIdentifier(table)
  return prisma.$executeRawUnsafe(`CREATE INDEX ON ${tableId} USING GIST(geom)`)
}

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
        nTotal,
        nModified,
        nAdded,
        nRemoved,
      }
    },
  )
}
