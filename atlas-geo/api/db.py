import os

database_server = os.environ.get('PGHOST', "localhost")
database_name = os.environ.get('POSTGRES_DB', "postgres")
database_user = os.environ.get('POSTGRES_USER', "postgres")
database_pw = os.environ.get('POSTGRES_PASSWORD', "mysecretpassword")
database_port = os.environ.get('POSTGRES_PORT', "5432")
api_secret = os.environ.get('API_SECRET', "")

conn_string = "host=%s dbname=%s user=%s password=%s port=%s" %(database_server, database_name, database_user, database_pw, database_port)
