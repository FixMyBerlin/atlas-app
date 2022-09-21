# Länge Weg

- Länge in das jsonb einfügen
- Einträge nach Länge filtern; also verschieben in die andere Tabelle mit \_skipNote

## Frage zu Einheit der LUA area/length function

https://github.com/openstreetmap/osm2pgsql/discussions/1756

# Verbindung Weg

Wege finden, die nicht an beiden Enden an einen anderen Weg in der DB grenzen.

# Einschränkungen von Fläche auf Weg

Friedhof => Kein öffentlichen Fußwegenetz
https://www.openstreetmap.org/way/24276614

# Verschieben Weg

Geometrien anhand der Straßenbreite oder Fallback verschieben

---

# area+relation

- Muss ich das getrennt prozessieren?
- Wie kann ich es in eine Tabelle mergen später?
- Was hat es mit https://github.com/openstreetmap/osm2pgsql/blob/b87b4c49e7e76f95c80fac128cb5ce0063964a64/flex-config/simple.lua#L157 auf sich? AKA mache ich das in dem \_relations.lua richtig?

# simplification

- Wie könnte ich in lua simplfien? oder besser direkt in PostGIS?

# length/area

https://github.com/openstreetmap/osm2pgsql/discussions/1756

# Area as points

Ich möchte die Shops die als Area getaggt sind als Points eintragen.
Wie mache ich das?

# Notes

-- projections:
-- Latlong (WGS84); 4326 => weltweit; einheit degree; GeoJSON
-- mercator 3857 (default) => welteit; metrische einheiten "3 m puffer"
