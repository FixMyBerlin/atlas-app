from db_configuration import export_geojson_function_from_type, verification_tables, verification_table
from db import conn_string
import psycopg2
from pathlib import Path

sql_functions_path = Path(__file__).with_name('INIT_FUNCTIONS.sql')
sql_views_path = Path(__file__).with_name('INIT_VERIFICATION_VIEWS.sql')

def create_or_replace_export_functions():
  conn = psycopg2.connect(conn_string)

  with conn.cursor() as cursor:
    print("Starting INIT of database for exports")
    with open(sql_functions_path, "r") as f:
      sql = f.read()
    for table_name, func_name in export_geojson_function_from_type.items():
      print('Create function', func_name, ' for table ', table_name)
      processed_sql = sql.replace('{func_name}', func_name).replace('{table_name}', table_name)
      cursor.execute(processed_sql)

    conn.commit()
  conn.close()
  print('=' * 80)
  print("Finished INIT of database")

def create_verification_tables():
  conn = psycopg2.connect(conn_string)

  with conn.cursor() as cursor:
    print("Starting creating tables for verification")
    with open(sql_views_path, "r") as f:
      sql = f.read()
    for table_name in verification_tables:
      print('Create verification table and view ', table_name)
      processed_sql = sql.format(
        verification_table=verification_table(table_name),
        geometry_table=table_name,
        joined_table=f'{table_name}_verified',
      )
      cursor.execute(processed_sql)

    conn.commit()
  conn.close()
  print('=' * 80)
  print("Finished creating tables for verification")

create_verification_tables()
create_or_replace_export_functions()
