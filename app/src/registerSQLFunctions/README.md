The functions in this folder are used to register our custom SQL functions.
They are being called on every server startup by [/src/insturmentation.ts](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation) and by calling the [/private/post-processing-hook](/app/src/app/api/private/post-processing-hook/route.ts) endpoint which happens after the processing finished.

1. `initExportFunctions(exportApiIdentifier)`
   Create the PostgreSQL functions that are used by the export API in `src/pages/api/export/[tableName].ts`
2. `initGeneralizationFunctions(InteracitvityConfiguartion)`
   Create the PostgreSQL functions that act as Martin function layers. Their main goal is to reduce tile size, which is archieved by simplifying geometries and leaving out tags that are not used in any style.
