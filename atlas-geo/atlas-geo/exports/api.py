from fastapi import FastAPI, Header, Response, Request, HTTPException
from fastapi.responses import FileResponse
from typing import Union
from osgeo import gdal
import psycopg2
import tempfile
import json

app = FastAPI(
    title="RadverkehrsatlasTools",
    description="Use and interact with OSM data from FixMyCity",
    version="0.0.1",
)

databaseServer = "localhost"
databaseName = "postgres"
databaseUser = "postgres"
databasePW = "mysecretpassword"

connString = "host=%s dbname=%s user=%s password=%s port=6000" %(databaseServer,databaseName,databaseUser,databasePW)

conn = psycopg2.connect(connString)

availableExportTables = {
  "bike_infrastructure": "export_geojson_bikeinfra",
  "lit": "export_geojson_lit",
  "highways": "export_geojson_bbox"
}

@app.get("/export/{type_name}")
def export_region(response: Response, type_name: str, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
    if type_name not in availableExportTables.keys():
      raise HTTPException(status_code=404, detail="export type unknown")

    cur = conn.cursor()

    # Download file directly
    response.headers["Content-Disposition"] = 'attachment; filename="export.geojson"'
    response.headers["Content-Type"] = 'application/geo+json'

    sql = "select * from " + availableExportTables[type_name] + "(%s, %s, %s, %s);"
    cur.execute(sql, ( minlon, minlat, maxlon, maxlat) )
    return cur.fetchone()[0]


@app.get("/export/{type_name}/shapefile")
def export_shapefile_region(response: Response, type_name: str, minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
    if type_name not in availableExportTables.keys():
      raise HTTPException(status_code=404, detail="export type unknown")

    cur = conn.cursor()

    sql = "select * from " + availableExportTables[type_name] + "(%s, %s, %s, %s);"
    cur.execute(sql, ( minlon, minlat, maxlon, maxlat) )
    geojson = cur.fetchone()[0]

    with tempfile.NamedTemporaryFile() as geojsonTmp:
      print(geojsonTmp.name)
      json.dump(geojson, geojsonTmp)
      srcDS = gdal.OpenEx(geojsonTmp.name+'.json')

      with tempfile.NamedTemporaryFile() as shapeTmp:
        ds = gdal.VectorTranslate(shapeTmp.name+'.shp', srcDS, format='ESRI Shapefile')

        response.headers["Content-Type"] = 'x-gis/x-shapefile'

        return FileResponse(shapeTmp.name)


@app.get("/verify/{type_name}/{osm_id}")
def export_region(response: Response, type_name: str, osm_id: int):
    cur = conn.cursor()

    sql = """insert into """
    cur.execute(sql, (minlon, minlat, maxlon, maxlat) )
    return cur.fetchone()[0]
