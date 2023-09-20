# Create export functions for our API.
# Format: { "<DB Table Name>": "public.<DB Function Name>" }
# init_db.py: Create a function per entry by calling INIT_FUNCTIONS.sql
# main.py: Provide the /export/<DB Table Name> entpoint
export_tables = [
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
]

# def export_function(table_name: str):
#   return f'atlas_export_geojson_{table_name.lower()}'

# main.py: Used as an allow list to guard the /verify/* API
# `atlas-app` only uses approved, rejected for now.
valid_verified_status = ['approved', 'rejected', 'undefined']


# The list of DB Tables Names that we support for verification.
# For each table `a` in the list we create a verification table `a_verification` and a view which joins both
verification_tables = ["bikelanes"]

# helper to retrieve the name of the verification table
def verification_table(table_name: str):
    return f'{table_name}_verification'

def verified_table(table_name: str):
    return f'{table_name}_verified'

def export_function(table_name: str):
    return f'atlas_export_geojson_{table_name.lower()}'