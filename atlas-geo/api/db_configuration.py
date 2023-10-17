from enum import Enum

# helper to retrieve the name of the verification table
def verification_table(table_name: str):
    return f'{table_name}_verification'

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
]])

# The list of DB Tables that support verification.
# For each table `a` in the list we create a verification table `a_verification` and a view which joins both
VerificationTable = Enum('Verication Table', [(verification_table(name), name) for name in ["bikelanes"]])

# main.py: Used as an allow list to guard the /verify/* API
# `atlas-app` only uses approved, rejected for now.
VerifiedState = Enum('Verify State', [(name, name) for name in ['approved', 'rejected', 'undefined']
])