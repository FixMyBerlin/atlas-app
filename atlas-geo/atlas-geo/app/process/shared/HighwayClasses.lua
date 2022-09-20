-- https://wiki.openstreetmap.org/wiki/DE:Key:highway
-- https://wiki.openstreetmap.org/wiki/Attribuierung_von_Stra%C3%9Fen_in_Deutschland
HighwayClasses = Set({
  -- "*_link" bedeutet "Autobahnzubringer", "Anschlussstelle", "Auf- / Abfahrt"
  "motorway", "motorway_link", -- "Autobahn"
  "trunk", "trunk_link", -- "Autobahnähnliche Straße", "Schnellstraßen" (those have motorroad=yes)
  "primary", "primary_link", -- "Bundesstraßen" (B XXX)
  "secondary", "secondary_link", -- "Landesstraße" (L XXX)
  "tertiary", "tertiary_link", -- "Kreisstraße", "Gemeindeverbindungsstraße", "Innerstädtische Vorfahrtstraßen mit Durchfahrtscharakter"
  "unclassified", -- "Nebenstraßen", "Gemeindestraße mit Verbindungscharakter"
  "residential", -- "Straße an und in Wohngebieten"
  "road", -- Ohne Klassifizierung
  "living_street", -- "Verkehrsberuhigter Bereich", "Spielstraße" traffic_sign=325.1 (Beginn), 326 (Ende)
  "service", -- "Zufahrtswege", aber auch "Grundstückszufahrt", Wege auf Parkplätzen, "Drive trough", "Gassen", "Feuerwehzufahrt"
  "pedestrian", -- "Fußgängerzone"
  "track", -- "Wirtschaftswege", "Wald- und Feldwege"
  "path",
  "footway",
  "cycleway",
  "bridleway", -- Reitweg
  "steps",
})
