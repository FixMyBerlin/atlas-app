from psycopg2 import sql
from constants import verification_views
from db import conn_string
import psycopg2

def refresh_materialized_views():
  conn = psycopg2.connect(conn_string)

  with conn.cursor() as cursor:
    print("Refreshing all materialized views")
    sql = "REFRESH MATERIALIZED VIEW {view_name};"
    for table_name, view_name in verification_views.items():
      print('Refresh materialized view ', view_name)
      processed_sql = sql.replace('{view_name}', view_name)
      cursor.execute(processed_sql)

    conn.commit()
    cursor.close()
    conn.close()
    print('=' * 80)
    print("Finished refreshing MATERIALIZED VIEWs")

refresh_materialized_views()
