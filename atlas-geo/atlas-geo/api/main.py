from fastapi import FastAPI, Header, Response, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse
from typing import Union, Annotated
from psycopg import sql
from psycopg.rows import dict_row
from db_configuration import valid_verified_status, export_tables, verification_tables, verification_table, export_function
from enum import Enum
from db import conn_string
import psycopg
import json
import os


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
  "http://127.0.0.1:5173",
  "https://develop--radverkehrsatlas.netlify.app",
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

exporttable = Enum('Export Table', [(name, name) for name in export_tables])
verificationtable = Enum('Verication Table', [(name, name) for name in verification_tables])
verifystate = Enum('Verify State', [(name, name) for name in valid_verified_status])

@app.get("/export/{type_name}")
async def export_bbox(response: Response, type_name: exporttable, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
  async with await psycopg.AsyncConnection.connect(conn_string) as conn:
    async with conn.cursor() as cur:
      # Download file directly
      response.headers["Content-Disposition"] = f'attachment; filename="{type_name}.geojson"'
      response.headers["Content-Type"] = 'application/geo+json'

      statement = sql.SQL("SELECT * FROM {table_name} (( SELECT * FROM ST_SetSRID(ST_MakeEnvelope(%s, %s, %s, %s), 4326) ));").format(table_name=sql.Identifier(export_function(type_name)))
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
async def retrieve_verify_status(response: Response, type_name: verificationtable, osm_id: int):

    async with await psycopg.AsyncConnection.connect(conn_string, row_factory=dict_row) as conn:
      async with conn.cursor() as cur:
        # Check if osm_id is available
        statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s ORDER BY verified_at DESC LIMIT 1").format(table_name=sql.Identifier(verification_table(type_name)))
        await cur.execute(statement, (osm_id,))

        results = await cur.fetchone()
        if results == None:
          statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s;").format(table_name=sql.Identifier(type_name))
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
async def retrieve_verify_history(response: Response, type_name: verificationtable, osm_id: int):
    async with await psycopg.AsyncConnection.connect(conn_string, row_factory=dict_row) as conn:
      async with conn.cursor() as cur:
        # Check if osm_id is available
        statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s ORDER BY verified_at DESC").format(table_name=sql.Identifier(verification_table(type_name)))
        await cur.execute(statement, (osm_id,))

        results = await cur.fetchall()
        if results == None:
          raise HTTPException(status_code=404, detail="osm_id not found")

        return results


# TODO: guard osm_type
@app.post("/verify/{type_name}/{osm_id}")
async def verify_osm_object(response: Response, type_name: verificationtable, osm_type: str, osm_id: int, verified_at: str, verified_status: verifystate, verified_by: int=None, comment: str=''):
    async with await psycopg.AsyncConnection.connect(conn_string) as conn:
      async with conn.cursor() as cur:
        # Check if osm_id is available
        statement = sql.SQL("SELECT osm_id FROM {table_name} l WHERE l.osm_id = %s").format(table_name=sql.Identifier(type_name))
        await cur.execute(statement, (osm_id,))

        results = await cur.fetchone()
        if results == None:
          raise HTTPException(status_code=404, detail="osm_id not found")

        statement = sql.SQL("INSERT INTO {table_name} (osm_type, osm_id, verified_at, verified_by, verified, comment) VALUES (%s, %s, %s, %s, %s, %s)").format(table_name=sql.Identifier(verification_table(type_name)))
        await cur.execute(statement, (osm_type, osm_id, verified_at, verified_by, verified_status, comment))
        await conn.commit()

        return 'OK'


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
