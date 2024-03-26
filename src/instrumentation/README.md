The functions in this folder are getting called on every server startup, they setup our custom DB functions and views
The file which contains the call back function is /src/insturmentation.ts
Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
This file will setup our DB

1. `initExportFunctions(exportApiIdentifier)`
   Create the PostgreSQL functions that are used by the export API in `src/pages/api/export/[tableName].ts`

Note: here exists a cross dependency between the front- and backend.
This requires that the backend allways completes the processing before we start the frontend, otherwise we might miss some tables that we require in the function creation.
