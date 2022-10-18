from fastapi import FastAPI, Header, Response, Request, HTTPException
from fastapi.responses import FileResponse
from typing import Union
from psycopg2 import sql
from constants import available_datasets
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

available_export_functions = {
  "bikelanes_tarmac": "export_geojson_bikeinfra",
  "lit": "export_geojson_lit",
  "shops_tarmac": "export_geojson_shops",
  "education_tarmac": "export_geojson_education",
  "publicTransport_tarmac": "export_geojson_publictransport",
  "places": "export_geojson_places",
  "roadClassification_tarmac": "export_geojson_roadtypes",
  "landuse": "export_geojson_landuse",
}

available_verification_tables = {
  "bicycleRoadInfrastructure": "bike_infrastructure_verification",
  "lit": "lit_verification",
  "highways": "highways_verification"
}

available_data_tables = {
  "bicycleRoadInfrastructure": "bicycleRoadInfrastrucutre",
  "lit": "lit",
  "highways": "highways"
}

verified_status = ['correct', 'false', 'undefined']

@app.get("/export/{type_name}")
def export_region(response: Response, type_name: str, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
    if type_name not in available_datasets:
      raise HTTPException(status_code=404, detail="export type unknown")

    cur = conn.cursor()

    # Download file directly
    response.headers["Content-Disposition"] = 'attachment; filename="export.geojson"'
    response.headers["Content-Type"] = 'application/geo+json'

    statement = sql.SQL("SELECT * FROM {table_name} (%s, %s, %s, %s);").format(table_name=sql.Identifier(available_export_functions[type_name]))
    cur.execute(statement, ( minlon, minlat, maxlon, maxlat) )
    return cur.fetchone()[0]


@app.get("/verify/{type_name}/{osm_id}")
def verify_osm_object(response: Response, type_name: str, osm_type: str, osm_id: int, verified_at: str, verified_by: int, verified: str):
    if type_name not in available_datasets:
      raise HTTPException(status_code=404, detail="export type unknown")

    # Check if verified string is valid
    if verified not in verified_status:
      raise HTTPException(status_code=400, detail="verified property is not valid")

    cur = conn.cursor()

    # Check if osm_id is available
    statement = sql.SQL("SELECT osm_id FROM {table_name} l WHERE l.osm_id = %s").format(table_name=sql.Identifier(available_data_tables[type_name]))
    cur.execute(statement, (osm_id,))

    results = cur.fetchone()
    if results != None and len(cur.fetchone()) < 1:
      raise HTTPException(status_code=404, detail="osm_id not found")

    statement = sql.SQL("INSERT INTO {table_name} (osm_type, osm_id, verified_at, verified_by, verified) VALUES (%s, %s, %s, %s, %s)").format(table_name=sql.Identifier(available_verification_tables[type_name]))
    cur.execute(statement, (osm_type, osm_id, verified_at, verified_by, verified ))
    conn.commit()
    return 'OK'


# @app.get("/export/{type_name}/shapefile")
# def export_shapefile_region(response: Response, type_name: str, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
#     if type_name not in availableExportTables.keys():
#       raise HTTPException(status_code=404, detail="export type unknown")

#     cur = conn.cursor()

#     sql = "select * from " + availableExportTables[type_name] + "(%s, %s, %s, %s);"
#     cur.execute(sql, ( minlon, minlat, maxlon, maxlat) )
#     geojson = cur.fetchone()[0]

#     with tempfile.NamedTemporaryFile() as geojsonTmp:
#       print(geojsonTmp.name)
#       json.dump(geojson, geojsonTmp)
#       srcDS = gdal.OpenEx(geojsonTmp.name+'.json')

#       with tempfile.NamedTemporaryFile() as shapeTmp:
#         ds = gdal.VectorTranslate(shapeTmp.name+'.shp', srcDS, format='ESRI Shapefile')

#         response.headers["Content-Type"] = 'x-gis/x-shapefile'

#         return FileResponse(shapeTmp.name)
