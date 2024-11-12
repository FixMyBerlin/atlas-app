/**
 * The path to the directory containing downloaded OSM files.
 */
export const OSM_DOWNLOAD_DIR = '/data/downloads'

/**
 * The path to the directory containing filtered OSM files.
 */
export const OSM_FILTERED_DIR = '/data/filtered'

/**
 * The path to the directory containing persistent data. E.g. directory hashes.
 */
export const PERSISTENT_DIR = '/data/hashes'

/**
 * The path to the directory containing the OSMIUM filter expressions.
 */
export const FILTER_DIR = '/processing/filter'

/**
 * The path to the file containing the OSMIUM filter expressions.
 */
export const FILTER_EXPRESSIONS = `${FILTER_DIR}/filter-expressions.txt`

/**
 * The path to the directory containing the topics.
 */
export const TOPIC_DIR = '/processing/topics'

/**
 * The file name for the id filtered OSM file.
 */
export const ID_FILTERED_FILE = `id_filtered.osm.pbf`
