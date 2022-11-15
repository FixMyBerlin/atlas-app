valid_verified_status = ['approved', 'rejected', 'undefined']

available_datasets = [
  "shops_tarmac",
  "education_tarmac",
  "publicTransport_tarmac",
  "places",
  "roadClassification_tarmac",
  "landuse",
  "bikelanes_tarmac",
  "lit"
]

available_export_functions = {
  "bikelanes_tarmac": "export_geojson_bikelanes",
  "lit": "export_geojson_lit",
  "shops_tarmac": "export_geojson_shops",
  "education_tarmac": "export_geojson_education",
  "publicTransport_tarmac": "export_geojson_publictransport",
  "places": "export_geojson_places",
  "roadClassification_tarmac": "export_geojson_roadtypes",
  "landuse": "export_geojson_landuse",
}

function_table_mapping = {
  "bikelanes": "export_geojson_bikelanes",
  "lit": "export_geojson_lit",
  "poiClassification": "export_geojson_shops",
  "education": "export_geojson_education",
  "publicTransport": "export_geojson_publictransport",
  "places": "export_geojson_places",
  "roadClassification": "export_geojson_roadtypes",
  "landuse": "export_geojson_landuse",
}

verification_tables = {
  "bikelanes_tarmac": "bikelanes_verification",
  "lit": "lit_verification",
  "roadClassification": "roadClassification_verification",
}

verification_views = {
  "bikelanes_verification": "bikelanes_verified",
  "lit_verification": "lit_verified",
  "roadClassification_verification": "roadClassification_verified",
}
