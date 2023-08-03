# Create export functions for our API.
# Format: { "<DB Table Name>": "public.<DB Function Name>" }
# init_db.py: Create a function per entry by calling INIT_FUNCTIONS.sql
# main.py: Provide the /export/<DB Table Name> entpoint
# TODO: handle this the same way as the verification tables see below
export_geojson_function_from_type = {
  "barrierAreas":       "atlas_export_geojson_barrierareas",
  "barrierLines":       "atlas_export_geojson_barrierlines",
  "bikelanes_verified": "atlas_export_geojson_bikelanes_verified",
  "bikelanes":          "atlas_export_geojson_bikelanes",
  "bikelanesPresence":  "atlas_export_geojson_bikelanesPresence",
  # "boundaries":         "atlas_export_geojson_boundaries", # does not work; we need to align the way we store the tags with the other table
  # "buildings":          "atlas_export_geojson_buildings", # same as above but due to clustering of connected buildings there is no good way to preseve (merge) tags
  "landuse":            "atlas_export_geojson_landuse",
  "lit":                "atlas_export_geojson_lit",
  "maxspeed":           "atlas_export_geojson_maxspeed",
  "places":             "atlas_export_geojson_places",
  "poiClassification":  "atlas_export_geojson_shops",
  "publicTransport":    "atlas_export_geojson_publictransport",
  "roadClassification": "atlas_export_geojson_roadtypes",
  "surfaceQuality":     "atlas_export_geojson_surfacequality",
}

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
