-- https://wiki.openstreetmap.org/wiki/DE:Key:highway
-- https://wiki.openstreetmap.org/wiki/Attribuierung_von_Stra%C3%9Fen_in_Deutschland
-- We keep the different highway classes separate so we can use them for filtering
-- to combine them use the function JoinSets in the ~/process/helper/JoinSets

-- "*_link" bedeutet "Autobahnzubringer", "Anschlussstelle", "Auf- / Abfahrt"
HighwayClasses = Set({
  "motorway", "motorway_link", -- "Autobahn"
  "trunk", "trunk_link", -- "Autobahnähnliche Straße", "Schnellstraßen" (those have motorroad=yes)
})

MajorRoadClasses = Set({
  "primary", "primary_link", -- "Bundesstraßen" (B XXX)
  "secondary", "secondary_link", -- "Landesstraße" (L XXX)
  "tertiary", "tertiary_link", -- "Kreisstraße", "Gemeindeverbindungsstraße", "Innerstädtische Vorfahrtstraßen mit Durchfahrtscharakter"
})

MinorRoadClasses = Set({
  "unclassified", -- "Nebenstraßen", "Gemeindestraße mit Verbindungscharakter"
  "residential", -- "Straße an und in Wohngebieten"
  "road", -- Ohne Klassifizierung
  "living_street", -- "Verkehrsberuhigter Bereich", "Spielstraße" traffic_sign=325.1 (Beginn), 326 (Ende)
  "service", -- "Zufahrtswege", aber auch "Grundstückszufahrt", Wege auf Parkplätzen, "Drive trough", "Gassen", "Feuerwehzufahrt"
})

PathClasses = Set({
  "pedestrian", -- "Fußgängerzone"
  "track", -- "Wirtschaftswege", "Wald- und Feldwege"
  "path",
  "footway",
  "cycleway",
  "bridleway", -- Reitweg
  "steps",
})
