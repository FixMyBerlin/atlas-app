from typing import Union
from psycopg2 import sql
from constants import available_datasets, function_table_mapping, verification_tables, verification_views
import psycopg2
import json
import os

databaseServer = os.environ.get('PGHOST', "localhost")
databaseName = os.environ.get('PGDATABASE', "postgres")
databaseUser = os.environ.get('PGUSER', "postgres")
databasePW = os.environ.get('PGPASSWORD', "mysecretpassword")
databasePort = os.environ.get('PGPORT', "5432")

connString = "host=%s dbname=%s user=%s password=%s port=%s" %(databaseServer, databaseName, databaseUser, databasePW, databasePort)

def create_or_replace_export_functions():
  conn = psycopg2.connect(connString)

  with conn.cursor() as cursor:
    print("Starting INIT of database for exports")
    with open("INIT_FUNCTIONS.sql", "r") as f:
      sql = f.read()
    for table_name, func_name in function_table_mapping.items():
      print('Create function', func_name,' for table ', table_name)
      processed_sql = sql.replace('{func_name}', func_name).replace('{table_name}', table_name)
      cursor.execute(processed_sql)

    conn.commit()
    cursor.close()
    conn.close()
    print('=' * 80)
    print("Finished INIT of database")

def create_verification_tables():
  conn = psycopg2.connect(connString)

  with conn.cursor() as cursor:
    print("Starting creating tables for verification")
    with open("INIT_VERIFICATION_TABLES.sql", "r") as f:
      sql = f.read()
    for original_table, table_name in verification_tables.items():
      print('Create verification table and view ', table_name)
      processed_sql = sql.replace('{table_name}', table_name).replace('{original_table}', original_table).replace('{view_name}', verification_views[table_name])
      cursor.execute(processed_sql)

    conn.commit()
    cursor.close()
    conn.close()
    print('=' * 80)
    print("Finished creating tables for verification")

create_or_replace_export_functions()
create_verification_tables()
