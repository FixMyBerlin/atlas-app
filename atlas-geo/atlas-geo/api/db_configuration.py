# Create export functions for our API.
# Format: { "<DB Table Name>": "public.<DB Function Name>" }
# init_db.py: Create a function per entry by calling INIT_FUNCTIONS.sql
# main.py: Provide the /export/<DB Table Name> entpoint
export_geojson_function_from_type = {
  "bikelanes_verified": "atlas_export_geojson_bikelanes_verified",
  "bikelanes":          "atlas_export_geojson_bikelanes",
  "bikelanesPresence":  "atlas_export_geojson_bikelanesPresence",
  "boundaries":         "atlas_export_geojson_boundaries",
  "buildings":          "atlas_export_geojson_buildings",
  "education":          "atlas_export_geojson_education",
  "landuse":            "atlas_export_geojson_landuse",
  "lit_verified":       "atlas_export_geojson_lit_verified",
  "lit":                "atlas_export_geojson_lit",
  "maxspeed":           "atlas_export_geojson_maxspeed",
  "places":             "atlas_export_geojson_places",
  "poiClassification":  "atlas_export_geojson_shops",
  "publicTransport":    "atlas_export_geojson_publictransport",
  "roadClassification": "atlas_export_geojson_roadtypes",
}

# main.py: Used as an allow list to guard the /verify/* API
# `atlas-app` only uses approved, rejected for now.
valid_verified_status = ['approved', 'rejected', 'undefined']

# The list of DB Tables Names that we support.
# main.py: Used as an allow list to guard the /verify/* API
valid_verified_datasets = [
  "bikelanes",
  "lit",
]

# Create DB views to join *_verified data with osm2pgsql-data
#   for pg_tileserv and for our API.
# Format: { "<osm2pgsql-DB Table Name>": "<DB View Name>"  }
# init_db.py: Create db views
# main.py: Used by a guard lookup ("osm_id")
# main.py: Provide the /verify/<osm2pgsql-DB Table Name> entpoint
#   (It's our convention to reuse the osm2pgsql-DB Table Name as an identifier.)
verification_tables = {
  "bikelanes": "bikelanes_verification",
  "lit": "lit_verification",
}

# Format: { "<DV View Name>": "<Verified-Table>"  }
# init_db.py: Used as part of the table view creation
joined_tables = {
  "bikelanes_verification": "bikelanes_verified",
  "lit_verification": "lit_verified",
}
