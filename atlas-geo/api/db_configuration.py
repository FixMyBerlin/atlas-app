valid_verified_status = ['approved', 'rejected', 'undefined']

export_geojson_function_from_type = {
  "bikelanes": "atlas_export_geojson_bikelanes",
  "bikelanes_verified": "atlas_export_geojson_bikelanes_verified",
  "lit": "atlas_export_geojson_lit",
  "lit_verified": "atlas_export_geojson_lit_verified",
  "poiClassification": "atlas_export_geojson_shops",
  "education": "atlas_export_geojson_education",
  "publicTransport": "atlas_export_geojson_publictransport",
  "places": "atlas_export_geojson_places",
  "roadClassification": "atlas_export_geojson_roadtypes",
  "landuse": "atlas_export_geojson_landuse",
  "maxspeed": "atlas_export_geojson_maxspeed",
  "buildings": "atlas_export_geojson_buildings",
}

verification_tables = {
  "bikelanes": "bikelanes_verification",
  "lit": "lit_verification",
}

joined_tables = {
  "bikelanes_verification": "bikelanes_verified",
  "lit_verification": "lit_verified",
}
