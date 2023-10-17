from db_configuration import ExportTable, VerificationTable, verification_table, verified_table, export_function
from db import conn_string
import psycopg
from pathlib import Path

sql_functions_path = Path(__file__).with_name('INIT_FUNCTIONS.sql')
sql_views_path = Path(__file__).with_name('INIT_VERIFICATION_VIEWS.sql')

def create_or_replace_export_functions():
  conn = psycopg.connect(conn_string)

  with conn.cursor() as cursor:
    print("Starting INIT of database for exports")
    with open(sql_functions_path, "r") as f:
      sql = f.read()
    for table in ExportTable:
      function_name = table.name
      print('Create function', function_name, ' for table ', table.value)
      processed_sql = sql.replace('{function_name}', function_name).replace('{table_name}', table.value)
      cursor.execute(processed_sql)

    conn.commit()
  conn.close()
  print('=' * 80)
  print("Finished INIT of database")

def create_verification_tables():
  conn = psycopg.connect(conn_string)

  with conn.cursor() as cursor:
    print("Starting creating tables for verification")
    with open(sql_views_path, "r") as f:
      sql = f.read()
    for table in VerificationTable:
      print('Create verification table and view ', table.value)
      processed_sql = sql.format(
        verification_table=table.name,
        geometry_table=table.value,
        joined_table=verified_table(table.value),
      )
      cursor.execute(processed_sql)

    conn.commit()
  conn.close()
  print('=' * 80)
  print("Finished creating tables for verification")

create_verification_tables()
create_or_replace_export_functions()
