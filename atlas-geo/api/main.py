from fastapi import FastAPI, Header, Response, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse
from typing import Union, Annotated
from psycopg import sql
from psycopg.rows import dict_row
from db_configuration import VerificationTable, ExportTable, VerifiedState, verified_table
from db import conn_string, api_secret
import psycopg
from pathlib import Path


app = FastAPI(
    title="RadverkehrsatlasTools",
    description="Use and interact with OSM data from FixMyCity",
    version="0.1.0",
    license_info={
       "name":"ODbL 1.0",
       "url": "https://opendatacommons.org/licenses/odbl/"
      }
)

origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173", # atlas-app with `npm run dev`
  "http://127.0.0.1:3000", # atlas-app with `npm run start`
  "https://develop--radverkehrsatlas.netlify.app", # Legacy
  "https://staging.radverkehrsatlas.de",
  "https://radverkehrsatlas.de",
  "https://www.radverkehrsatlas.de",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.get("/export/{type_name}")
async def export_bbox(response: Response, type_name: ExportTable, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
  async with await psycopg.AsyncConnection.connect(conn_string) as conn:
    async with conn.cursor() as cur:
      # Download file directly
      response.headers["Content-Disposition"] = f'attachment; filename="{type_name.value}.geojson"'
      response.headers["Content-Type"] = 'application/geo+json'

      statement = sql.SQL("SELECT * FROM {table_name} (( SELECT * FROM ST_SetSRID(ST_MakeEnvelope(%s, %s, %s, %s), 4326) ));").format(table_name=sql.Identifier(type_name.name))
      await cur.execute(statement, ( minlon, minlat, maxlon, maxlat) )
      result = await cur.fetchone()
      return result[0]

@app.get("/boundaries/")
async def export_boundaries(response: Response, ids: Annotated[list[int], Query()]):
    async with await psycopg.AsyncConnection.connect(conn_string, row_factory=dict_row) as conn:
      async with conn.cursor() as cur:
        # Check if ids are available
        statement = sql.SQL("SELECT osm_id FROM boundaries WHERE osm_id = ANY(%s)")
        await cur.execute(statement, (ids, ))
        results = await cur.fetchall()
        if results == None or len(results) != len(ids):
          raise HTTPException(status_code=404, detail="Couldn't find given ids. At least one id is wrong or dupplicated.")

        response.headers["Content-Disposition"] = 'attachment; filename="boundaries_'+ '_'.join(map(str, ids)) +'.geojson"'
        response.headers["Content-Type"] = 'application/geo+json'

        statement = sql.SQL("SELECT ST_AsGeoJSON(ST_Transform(ST_UNION(geom), 4326))::jsonb AS geom FROM boundaries WHERE osm_id = ANY(%s)")
        await cur.execute(statement, (ids, ) )
        result = await cur.fetchone()

        return result['geom']


@app.get("/verify/{type_name}/{osm_id}")
async def retrieve_verify_status(response: Response, type_name: VerificationTable, osm_id: int):

    async with await psycopg.AsyncConnection.connect(conn_string, row_factory=dict_row) as conn:
      async with conn.cursor() as cur:
        # Check if osm_id is available
        statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s ORDER BY verified_at DESC LIMIT 1").format(table_name=sql.Identifier(type_name.name))
        await cur.execute(statement, (osm_id,))

        results = await cur.fetchone()
        if results == None:
          statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s;").format(table_name=sql.Identifier(type_name.value))
          await cur.execute(statement, (osm_id,))
          results = await cur.fetchone()
          if results == None:
            raise HTTPException(status_code=404, detail="osm_id not found")
          return {
            "osm_id": osm_id,
            "verified": "none"
          }
        return results


@app.get("/verify/{type_name}/{osm_id}/history")
async def retrieve_verify_history(response: Response, type_name: VerificationTable, osm_id: int):
    async with await psycopg.AsyncConnection.connect(conn_string, row_factory=dict_row) as conn:
      async with conn.cursor() as cur:
        # Check if osm_id is available
        statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s ORDER BY verified_at DESC").format(table_name=sql.Identifier(type_name.name))
        await cur.execute(statement, (osm_id,))

        results = await cur.fetchall()
        if results == None:
          raise HTTPException(status_code=404, detail="osm_id not found")

        return results


# TODO: guard `osm_type` and `verified_at`
@app.post("/verify/{type_name}/{osm_id}")
async def verify_osm_object(response: Response, type_name: VerificationTable, osm_type: str, osm_id: int, verified_at: str, verified_status: VerifiedState, verified_by: int=None, comment: str=''):
    async with await psycopg.AsyncConnection.connect(conn_string) as conn:
      async with conn.cursor() as cur:
        # Check if osm_id is available
        statement = sql.SQL("SELECT osm_id FROM {table_name} l WHERE l.osm_id = %s").format(table_name=sql.Identifier(type_name.value))
        await cur.execute(statement, (osm_id,))

        results = await cur.fetchone()
        if results == None:
          raise HTTPException(status_code=404, detail="osm_id not found")

        statement = sql.SQL("INSERT INTO {table_name} (osm_type, osm_id, verified_at, verified_by, verified, comment) VALUES (%s, %s, %s, %s, %s, %s)").format(table_name=sql.Identifier(type_name.name))
        await cur.execute(statement, (osm_type, osm_id, verified_at, verified_by, verified_status.name, comment))
        await conn.commit()

        return 'OK'

@app.get("/init")
async def init_api(response: Response, secret: str):
  if secret != api_secret:
    raise HTTPException(status_code=401, detail="the API secret is wrong. Access denied!")
  async with await psycopg.AsyncConnection.connect(conn_string) as conn:
    async with conn.cursor() as cur:
      print("Starting creation of verification tables")

      sql_views_path = Path(__file__).with_name('INIT_VERIFICATION_VIEWS.sql')
      with open(sql_views_path, "r") as f:
        sql = f.read()
      for table in VerificationTable:
        print('Create verification table and view ', table.value)
        processed_sql = sql.format(
          verification_table="BikelaneVerification", # table.name,
          geometry_table="bikelanes", # table.value,
          joined_table="bikelanes_verified", # verified_table(table.value),
        )
        await cur.execute(processed_sql)
      await conn.commit()

      print('=' * 80)
      print("Finished creation of verification tables")

      print("Starting creation of database exports")
      sql_functions_path = Path(__file__).with_name('INIT_FUNCTIONS.sql')
      with open(sql_functions_path, "r") as f:
        sql = f.read()
      for table in ExportTable:
        function_name = table.name
        print('Create function', function_name, ' for table ', table.value)
        processed_sql = sql.replace('{function_name}', function_name).replace('{table_name}', table.value)
        await cur.execute(processed_sql)
      await conn.commit()

      print('=' * 80)
      print("Finished creation of database exports")
      print('=' * 80)
      print("Finished database initialization")


@app.get("/health")
async def retrieve_service_health():
    async with await psycopg.AsyncConnection.connect(conn_string) as conn:
      async with conn.cursor() as cur:
        try:
          await cur.execute(sql.SQL("SELECT 1"))
        except:
          raise HTTPException(status_code=500, detail="DB Connection is dead")
        else:
          return "OK"
