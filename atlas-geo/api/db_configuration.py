from enum import Enum

# Helper to retrieve the name of the verification table
# The verification table is owned by prisma and part of the prisma schema.
# See https://github.com/FixMyBerlin/atlas-app/blob/develop/db/schema.prisma
def verification_table(table_name: str):
    # needs to be wrapped in quotes to preserve capitalization
    return f'"{table_name}Verification"'

def verified_table(table_name: str):
    return f'{table_name}_verified'

def export_function(table_name: str):
    return f'atlas_export_geojson_{table_name.lower()}'

# Te list of DB Tables which support exports.
ExportTable = Enum('Export Table', [(export_function(name), name) for name in [
  "barrierAreas",
  "barrierLines",
  "bikelanes_verified",
  "bikelanes",
  "boundaries",
  "roads",
  "landuse",
  "places",
  "poiClassification",
  "publicTransport",
  "trafficSigns",
  # TODO, this causes the error…
    # api    |   File "/app/main.py", line 165, in init_api
    # api    |     await cur.execute(processed_sql)     (…)
    # api    | psycopg.errors.SyntaxError: syntax error at or near "-"
    # api    | LINE 2: ...UNCTION public.atlas_export_geojson_bicycleparking-points(re...
  "bicycleParking_points",
  "bicycleParking_areas"
]])

# The list of DB Tables that support verification.
# For each table `a` in the list we create a verification table `a_verification` and a view which joins both
# TODO: This part is not used ATM. Instead in api/main.py we pass the names manually.
# The issue is, that the Verification Table is now owned by Prisma with consols the naming schema.
# Also we have it as BikelaneVerificaition (singular) in Prisma.
# We need to either fix our conventions or change this Enum to an object that holds the name for all
# three tables `verification_table`, `geometry_table`, `joined_table`
VerificationTable = Enum('Verication Table', [(verification_table(name), name) for name in ["Bikelane"]])

# main.py: Used as an allow list to guard the /verify/* API
# `atlas-app` only uses approved, rejected for now.
VerifiedState = Enum('Verify State', [(name, name) for name in ['approved', 'rejected', 'undefined']
])
