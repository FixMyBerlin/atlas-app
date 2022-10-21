valid_verified_status = ['correct', 'false', 'undefined']

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
  "bikelanes_tarmac": "export_geojson_bikeinfra",
  "lit": "export_geojson_lit",
  "shops_tarmac": "export_geojson_shops",
  "education_tarmac": "export_geojson_education",
  "publicTransport_tarmac": "export_geojson_publictransport",
  "places": "export_geojson_places",
  "roadClassification_tarmac": "export_geojson_roadtypes",
  "landuse": "export_geojson_landuse",
}

function_table_mapping = {
  "bicycleRoadInfrastructure": "export_geojson_bikeinfra",
  "lit": "export_geojson_lit",
  "fromTo_shopping": "export_geojson_shops",
  "fromTo_education": "export_geojson_education",
  "fromTo_publicTransport": "export_geojson_publictransport",
  "places": "export_geojson_places",
  "roadtypesOsm": "export_geojson_roadtypes",
  "fromTo_landuse": "export_geojson_landuse",
}

verification_tables = {
  "bicycleRoadInfrastructure": "bike_infrastructure_verification",
  "lit": "lit_verification",
  "roadtypesOsm": "roadtypesOsm_verification",
}

verification_views = {
  "bike_infrastructure_verification": "bike_infrastructure_verified",
  "lit_verification": "lit_verified",
  "roadtypesOsm_verification": "roadtypesOsm_verified",
}
