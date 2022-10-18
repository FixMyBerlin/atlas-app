from typing import Union
from psycopg2 import sql
from constants import available_datasets
import psycopg2
import json
import os


# TODO does not work yet
def init_db_exports():
  databaseServer = os.environ.get('PGHOST', "localhost")
  databaseName = os.environ.get('PGDATABASE', "postgres")
  databaseUser = os.environ.get('PGUSER', "postgres")
  databasePW = os.environ.get('PGPASSWORD', "mysecretpassword")
  databasePort = os.environ.get('PGPORT', "5432")

  connString = "host=%s dbname=%s user=%s password=%s port=%s" %(databaseServer, databaseName, databaseUser, databasePW, databasePort)

  conn = psycopg2.connect(connString)

  with conn as cursor:
      print("Starting INIT of database for exports")
      cursor.execute(open("INIT.sql", "r").read())
      cursor.close()
      conn.close()
      print("Finished INIT of database for exports")

