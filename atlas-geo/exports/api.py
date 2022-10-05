from fastapi import FastAPI, Header, Response, Request
from fastapi.responses import FileResponse
from typing import Union
import psycopg2

app = FastAPI(
    title="RadverkehrsatlasTools",
    description="Use and interact with OSM data from FixMyCity",
    version="0.0.1",
    license_info={
        "name": "Apache 2.0",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
)



databaseServer = "localhost"
databaseName = "postgres"
databaseUser = "postgres"
databasePW = "mysecretpassword"

connString = "host=%s dbname=%s user=%s password=%s port=6000" %(databaseServer,databaseName,databaseUser,databasePW)

conn = psycopg2.connect(connString)

# availableExportTables = {
#   bicycleRoadInfrastructure: "export_geojson_bikeinfra"
#   highway: "export_geojson_bbox"
# }

@app.get("/export")
def export_region(response: Response, type="bicycleRoadInfrastructure", minlon: float= 13.3, minlat : float=52.2, maxlon: float=13.7, maxlat: float=52.3):
    cur = conn.cursor()

    # Download file directly
    response.headers["Content-Disposition"] = 'attachment; filename="export.geojson"'
    response.headers["Content-Type"] = 'application/geo+json'

    sql = """select * from export_geojson_bbox(%s, %s, %s, %s);"""
    cur.execute(sql, (minlon, minlat, maxlon, maxlat) )
    return cur.fetchone()[0]
