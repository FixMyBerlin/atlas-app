from fastapi import FastAPI, Header, Response, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Union
from psycopg2 import sql
from db_configuration import valid_verified_datasets, export_geojson_function_from_type, verification_tables, valid_verified_status
from db import conn_string
import psycopg2
import psycopg2.extras
import json
import os

app = FastAPI(
    title="RadverkehrsatlasTools",
    description="Use and interact with OSM data from FixMyCity",
    version="0.1.0",
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

conn = psycopg2.connect(conn_string)

@app.get("/export/{type_name}")
def export_region(response: Response, type_name: str, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
    if type_name not in valid_verified_datasets:
      raise HTTPException(status_code=404, detail="export type unknown")

    with conn.cursor() as cur:
      # Download file directly
      response.headers["Content-Disposition"] = 'attachment; filename="'+type_name+'.geojson"'
      response.headers["Content-Type"] = 'application/geo+json'

      statement = sql.SQL("SELECT * FROM {table_name} (%s, %s, %s, %s);").format(table_name=sql.Identifier(export_geojson_function_from_type[type_name]))
      cur.execute(statement, ( minlon, minlat, maxlon, maxlat) )
      result = cur.fetchone()[0]

      return result


@app.get("/verify/{type_name}/{osm_id}")
def retrieve_verify_status(response: Response, type_name: str, osm_id: int):
    if type_name not in valid_verified_datasets:
      raise HTTPException(status_code=404, detail="verification type unknown")

    with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as cur:
      # Check if osm_id is available
      statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s ORDER BY verified_at DESC LIMIT 1").format(table_name=sql.Identifier(verification_tables[type_name]))
      cur.execute(statement, (osm_id,))

      results = cur.fetchone()
      if results == None:
        statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s;").format(table_name=sql.Identifier(type_name))
        cur.execute(statement, (osm_id,))
        results = cur.fetchone()
        return {
          "osm_id": osm_id,
          "verified": "none"
        }
      return results


@app.get("/verify/{type_name}/{osm_id}/history")
def retrieve_verify_history(response: Response, type_name: str, osm_id: int):
    if type_name not in valid_verified_datasets:
      raise HTTPException(status_code=404, detail="verification type unknown")

    with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as cur:
      # Check if osm_id is available
      statement = sql.SQL("SELECT * FROM {table_name} WHERE osm_id = %s ORDER BY verified_at DESC").format(table_name=sql.Identifier(verification_tables[type_name]))
      cur.execute(statement, (osm_id,))

      results = cur.fetchall()
      if results == None:
        raise HTTPException(status_code=404, detail="osm_id not found")

      return results


@app.post("/verify/{type_name}/{osm_id}")
def verify_osm_object(response: Response, type_name: str, osm_type: str, osm_id: int, verified_at: str, verified_status: str, verified_by: int=None, comment: str=''):
    if type_name not in valid_verified_datasets:
      raise HTTPException(status_code=404, detail="verification type unknown")

    if verified_status not in valid_verified_status:
      raise HTTPException(status_code=400, detail="verified_status property is not valid")

    with conn.cursor() as cur:
      # Check if osm_id is available
      statement = sql.SQL("SELECT osm_id FROM {table_name} l WHERE l.osm_id = %s").format(table_name=sql.Identifier(type_name))
      cur.execute(statement, (osm_id,))

      results = cur.fetchone()
      if results == None:
        raise HTTPException(status_code=404, detail="osm_id not found")

      statement = sql.SQL("INSERT INTO {table_name} (osm_type, osm_id, verified_at, verified_by, verified, comment) VALUES (%s, %s, %s, %s, %s, %s)").format(table_name=sql.Identifier(verification_tables[type_name]))
      cur.execute(statement, (osm_type, osm_id, verified_at, verified_by, verified_status, comment))
      conn.commit()

      return 'OK'


@app.get("/health")
def retrieve_service_health():
    with conn.cursor() as cur:
      try:
        cur.execute(sql.SQL("SELECT 1"))
      except:
        raise HTTPException(status_code=500, detail="DB Connection is dead")
      else:
        return "OK"

    raise HTTPException(status_code=500, detail="Unkown server error")


@app.on_event("shutdown")
def shutdown_event():
    conn.close()
