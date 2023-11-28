# this is _supposed_ to be quick'n'dirty
import psycopg
from datetime import datetime, timedelta
from random import randint
from db import conn_string

# TODO: 'lit' does not have a verification table anymore
geometry_table = 'lit'
verification_table = 'lit_verification'

num_chunks = 100
chunk_size = 10000

conn = psycopg.connect(conn_string)
cursor = conn.cursor()
cursor.execute(f'select distinct osm_id from {geometry_table};')
ids = cursor.fetchall()
ids = [id[0] for id in ids]

cursor.execute(f'TRUNCATE TABLE prisma."{verification_table}";')

start_dt = datetime(year=2022, month=1, day=1)
ms = 11 * 30 * 24 * 60 * 60 * 1000  # 11 months

print(f'inserting {num_chunks * chunk_size} rows...')

for chunk in range(num_chunks):
  print(f'chunk {chunk} / {num_chunks}')
  sql = f'INSERT INTO prisma."{verification_table}" (osm_type,osm_id,verified_at,verified_by,verified) VALUES\n'
  for line in range(chunk_size):
    id = ids[randint(0, len(ids) - 1)]
    dt = (start_dt + timedelta(milliseconds=randint(0, ms))).isoformat()
    status = 'approved' if randint(0, 1) else 'rejected'
    line = f"  ('W',{id},'{dt}',NULL,'{status}'),\n"
    sql += line
  sql = sql[:-2] + ';\n'
  sql += 'end;\n'
  cursor.execute(sql)

print('done.')
