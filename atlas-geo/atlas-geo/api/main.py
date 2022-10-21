from fastapi import FastAPI, Header, Response, Request, HTTPException
from fastapi.responses import FileResponse
from typing import Union
from psycopg2 import sql
from constants import available_datasets, available_export_functions, verification_tables, valid_verified_status
import psycopg2
import json
import os

app = FastAPI(
    title="RadverkehrsatlasTools",
    description="Use and interact with OSM data from FixMyCity",
    version="0.0.1",
)

databaseServer = os.environ.get('PGHOST', "db")
databaseName = os.environ.get('PGDATABASE', "postgres")
databaseUser = os.environ.get('PGUSER', "postgres")
databasePW = os.environ.get('PGPASSWORD', "mysecretpassword")

connString = "host=%s dbname=%s user=%s password=%s" %(databaseServer, databaseName, databaseUser, databasePW)

conn = psycopg2.connect(connString)

@app.get("/export/{type_name}")
def export_region(response: Response, type_name: str, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
    if type_name not in available_datasets:
      raise HTTPException(status_code=404, detail="export type unknown")

    cur = conn.cursor()

    # Download file directly
    response.headers["Content-Disposition"] = 'attachment; filename="'+type_name+'.geojson"'
    response.headers["Content-Type"] = 'application/geo+json'

    statement = sql.SQL("SELECT * FROM {table_name} (%s, %s, %s, %s);").format(table_name=sql.Identifier(available_export_functions[type_name]))
    cur.execute(statement, ( minlon, minlat, maxlon, maxlat) )
    return cur.fetchone()[0]


@app.get("/verify/{type_name}/{osm_id}")
def verify_osm_object(response: Response, type_name: str, osm_type: str, osm_id: int, verified_at: str, verified_status: str,verified_by: int= None):
    if type_name not in available_datasets:
      raise HTTPException(status_code=404, detail="export type unknown")

    if verified_status not in valid_verified_status:
      raise HTTPException(status_code=400, detail="verified_status property is not valid")

    cur = conn.cursor()

    # Check if osm_id is available
    statement = sql.SQL("SELECT osm_id FROM {table_name} l WHERE l.osm_id = %s").format(table_name=sql.Identifier(type_name))
    cur.execute(statement, (osm_id,))

    results = cur.fetchone()
    if results == None:
      raise HTTPException(status_code=404, detail="osm_id not found")

    statement = sql.SQL("INSERT INTO {table_name} (osm_type, osm_id, verified_at, verified_by, verified) VALUES (%s, %s, %s, %s, %s)").format(table_name=sql.Identifier(verification_tables[type_name]))
    cur.execute(statement, (osm_type, osm_id, verified_at, verified_by, verified_status ))
    conn.commit()
    return 'OK'
