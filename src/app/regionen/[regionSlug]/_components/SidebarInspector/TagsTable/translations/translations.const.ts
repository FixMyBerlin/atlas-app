import { translationsParking } from './translationsParking.const'

// Legend:
// - "ALL--" stands for "all sources". Those translations are applied without checking the soureId
// - "ALL--category" is replaced with 'ALL--highway' in `ConditionalFormattedValue`
/* prettier-ignore */
export const translations: { [key: string]: string } = {
  ...translationsParking,
  'ALL--_parent_highway--key': 'Straßentyp Fahrbahn',
  'ALL--category--key': 'Führungsform',
  'ALL--category=bicycleRoad_vehicleDestination': 'Fahrradstraße mit Anlieger frei',
  'ALL--category=bicycleRoad': 'Fahrradstraße',
  'ALL--category=crossing': 'Straßenquerung',
  'ALL--category=cycleway_adjoining': 'Radweg (baulich von der Fahrbahn abgesetzt aber straßenbegleitend)',
  'ALL--category=cycleway_isolated': 'Radweg, selbstständig geführt',
  'ALL--category=cycleway_isolatedOrIdjoining': 'Radweg (Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
  'ALL--category=cyclewayLink': 'Radweg-Verbindungsstück. Häufig in OpenStreetMap verwendet um Routenfähiges Netz zu erzeugen; repräsentiert nur selten physische Infrastruktur.',
  'ALL--category=cyclewayOnHighway_advisory': 'Schutzstreifen',
  'ALL--category=cyclewayOnHighway_advisoryOrExclusive': 'Radfahrstreifen oder Schutzstreifen (Kategorisierung unklar)',
  'ALL--category=cyclewayOnHighway_exclusive': 'Radfahrstreifen',
  'ALL--category=cyclewayOnHighwayBetweenLanes': 'Radfahrstreifen in Mittellage (Fahrradweiche)',
  'ALL--category=footAndCyclewaySegregated_adjoining': 'Getrennter Rad- und Gehweg, straßenbegleitend',
  'ALL--category=footAndCyclewaySegregated_adjoiningOrIsolated': 'Getrennter Rad- und Gehweg (Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
  'ALL--category=footAndCyclewaySegregated_isolated': 'Getrennter Rad- und Gehweg, selbstständig geführt',
  'ALL--category=footAndCyclewayShared_adjoining': 'Gemeinsamer Geh- und Radweg, straßenbegleitend',
  'ALL--category=footAndCyclewayShared_adjoiningOrIsolated': 'Gemeinsamer Geh- und Radweg (Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
  'ALL--category=footAndCyclewayShared_isolated': 'Gemeinsamer Geh- und Radweg, selbstständig geführt',
  'ALL--category=footwayBicycleYes_adjoining': 'Gehweg mit Radwegfreigabe, straßenbegleitend',
  'ALL--category=footwayBicycleYes_adjoiningOrIsolated': 'Gehweg mit Radwegfreigabe (Straßenbegleitend oder selbstständig geführt; Kategorisierung unklar)',
  'ALL--category=footwayBicycleYes_isolated': 'Gehweg mit Radwegfreigabe, selbstständig geführt',
  'ALL--category=livingStreet': 'Verkehrsberuhigter Bereich (Spielstraße)',
  'ALL--category=needsClarification': 'Führungsform unklar. Die Attribute in OpenStreetMap sind nicht ausreichend, um die Führungsform zu kategorisieren. Das deutet darauf hin, dass zusätzlich Attribute in OSM ergänzt werden müssen.',
  'ALL--category=pedestrianAreaBicycleYes': 'Fußgängerzone, Fahrrad frei',
  'ALL--category=separate_geometry': 'RVA als separate Geometrie erfasst',
  'ALL--category=sharedBusLane': 'Busfahrstreifen mit Freigabe Radverkehr',
  'ALL--category=sharedBusLaneBikeWithBus': 'Radfahrstreifen mit Freigabe Busverkehr',
  'ALL--category=sharedMotorVehicleLane': 'Gemeinsamer Fahrstreifen', // Anteilig genutzten Fahrstreifen
  'ALL--composit_mapillary--key': 'Mapillary',
  'ALL--composit_surface_smoothness--key': 'Oberflächenqualität',
  'ALL--confidence=high': 'Hoch',
  'ALL--confidence=medium': 'Mittel',
  'ALL--description--key': 'Hinweis aus OSM',
  'ALL--fresh=fresh_check_at': 'Wert wurde in den letzten 2 Jahre überprüft und die Prüfung explizit vermerkt.',
  'ALL--fresh=fresh_update_at': 'Wert ist wahrscheinlich aktuell da die Attribute der Geometrie in den letzten 2 Jahren editiert wurden.',
  'ALL--fresh=outdated_check_at': 'Es wurde ein explizites Prüf-Datum erfasst das aber älter als 2 Jahre ist.',
  'ALL--fresh=outdated_update_at': 'Die Attribute dieser Geometrie wurden länger als 2 Jahre nicht bearbeitet.',
  'ALL--highway--key': 'Straßentyp',
  'ALL--highway=bicycle_road': 'Fahrradstraße', // roads--category
  'ALL--highway=construction': 'Straße ist in Bau',
  'ALL--highway=cycleway': 'Radweg',
  'ALL--highway=footway_sidewalk': 'Gehweg',
  'ALL--highway=footway': 'Fußweg',
  'ALL--highway=living_street': 'Verkehrsberuhigter Bereich',
  'ALL--highway=motorway': 'Autobahn',
  'ALL--highway=path': 'Weg / Pfad',
  'ALL--highway=pedestrian': 'Fußgängerzone',
  'ALL--highway=primary': 'Bundesstraße/Hauptverbindungsstraße',
  'ALL--highway=residential': 'Anwohnerstraße',
  'ALL--highway=secondary': 'Landesstraße/Wichtige Durchgangsstraße',
  'ALL--highway=service_alley': 'Gasse', // roads--category
  'ALL--highway=service_driveway': 'Grundstückszufahrt', // roads--category
  'ALL--highway=service_parking_aisle': 'Parkplatzweg', // roads--category
  'ALL--highway=service_road': 'Zufahrtsweg', // roads--category
  'ALL--highway=service_uncategorized': 'Zufahrtsweg (unbekannte Klassifisierung)',
  'ALL--highway=service': 'Zufahrtsweg',
  'ALL--highway=steps': 'Stufen',
  'ALL--highway=tertiary': 'Kreisstraße/Untergeordnete Durchgangsstraße',
  'ALL--highway=track': 'Wald- / Feldweg',
  'ALL--highway=unclassified': 'Nebenstraße mit Verbindungscharakter',
  'ALL--highway=unspecified_road_category': 'Unkategorisierte Straße', // roads--category
  'ALL--maxspeed--key': 'Höchstgeschwindigkeit',
  'ALL--name--key': 'Name',
  'ALL--oneway--key': 'Fahrtrichtung',
  'ALL--osm_traffic_sign--key': 'Verkehrszeichen',
  'ALL--osm_traffic_sign:backward--key': 'Verkehrszeichen Gegenrichtung',
  'ALL--osm_traffic_sign:backward=none': 'Unbeschildert',
  'ALL--osm_traffic_sign:forward--key': 'Verkehrszeichen in Fahrtrichtung',
  'ALL--osm_traffic_sign:forward=none': 'Unbeschildert',
  'ALL--osm_traffic_sign=none': 'Unbeschildert',
  'ALL--smoothness=bad': 'Schlecht',
  'ALL--smoothness=excellent': 'Sehr gut',
  'ALL--smoothness=good': 'Gut',
  'ALL--smoothness=intermediate': 'Mittel gut',
  'ALL--smoothness=very_bad': 'Sehr schlecht',
  'ALL--surface=asphalt': 'Asphalt',
  'ALL--surface=cobblestone': 'Kopfsteinpflaster',
  'ALL--surface=compacted': 'Verdichtete Deckschicht',
  'ALL--surface=concrete:lanes': 'Betonspurplatten',
  'ALL--surface=concrete:plates': 'Betonplatten',
  'ALL--surface=concrete': 'Beton',
  'ALL--surface=dirt': 'Erde/Boden',
  'ALL--surface=fine_gravel': 'Fester Splitt oder Grand',
  'ALL--surface=grass_paver': 'Rasengitterstein',
  'ALL--surface=grass': 'Gras',
  'ALL--surface=gravel': 'Schotter',
  'ALL--surface=ground': 'Erde/Boden',
  'ALL--surface=metal': 'Metall',
  'ALL--surface=paved': 'Versiegelte Oberfläche (unspezifisch)',
  'ALL--surface=paving_stones': 'Verbundpflastersteine',
  'ALL--surface=pebblestone': 'Kies',
  'ALL--surface=sand': 'Sand',
  'ALL--surface=sett': 'Behauenes Steinpflaster (Kopfsteinpflaster)',
  'ALL--surface=unhewn_cobblestone': 'Kopfsteinpflaster',
  'ALL--surface=unpaved': 'Unbefestigt (unspezifisch)',
  'ALL--width--key': 'Breite',
  'atlas_bicycleParking--capacity--key': 'Anzahl Fahrrad-Stellplätze',
  'atlas_bicycleParking--capacity:cargo_bike--key': 'Anzahl Lastenfahrrad-Stellplätze',
  'atlas_bicycleParking--title': 'Fahrradstellplätze',
  'atlas_bikelanes--category--key': 'Straßentyp',
  'atlas_bikelanes--oneway=car_not_bike': 'Einbahnstraße für Kfz aber Zweirichtungsradwege',
  'atlas_bikelanes--oneway=implicit_no': 'Zweirichtungsradweg (implizite Angabe)',
  'atlas_bikelanes--oneway=implicit_yes': 'Einrichtungsradweg (implizite Angabe)',
  'atlas_bikelanes--oneway=no': 'Zweirichtungsradwege',
  'atlas_bikelanes--oneway=yes': 'Einrichtungsradweg',
  'atlas_bikelanes--smoothness_source=mtb:scale_to_smoothness': 'Abgeleitet von dem OSM Wert `mtb:scale`',
  'atlas_bikelanes--smoothness_source=surface_to_smoothness': 'Abgeleitet von dem Wert der Oberfläche über Standard-Werte',
  'atlas_bikelanes--smoothness_source=tag': 'OSM-Tag `smoothness`',
  'atlas_bikelanes--smoothness_source=tracktype_to_smoothness': 'Abgeleitet von dem OSM Wert `tracktype`',
  'atlas_bikelanes--surface_source=tag': 'OSM-Tag `surface`',
  'atlas_bikelanes--title': 'Daten zur Radinfrastruktur',
  'atlas_boundaries--admin_level--key': 'Grenzen Level',
  'atlas_boundaries--admin_level=7': 'Level 7 — Meistens Verwaltungsgemeinschaft, Amt', // https://wiki.openstreetmap.org/wiki/DE:Grenze
  'atlas_boundaries--admin_level=8': 'Level 8 — Meistens (Kreisangehörige) Gemeinde / Stadt',
  'atlas_boundaries--title': 'Grenzen',
  'atlas_landuse--landuse--key': 'Landnutzung',
  'atlas_landuse--landuse=allotments': 'Kleingartenanlage',
  'atlas_landuse--landuse=cemetery': 'Friedhofsgelände',
  'atlas_landuse--landuse=commercial': 'Gewerbliche Nutzung',
  'atlas_landuse--landuse=farmyard': 'Landwirdschaftliche Nutzung',
  'atlas_landuse--landuse=residential': 'Wohngebiet',
  'atlas_landuse--landuse=retail': 'Gewerbliche Nutzung (Einzelhandel/Geschäfte)',
  'atlas_landuse--landuse=school': 'Schulgelände',
  'atlas_landuse--landuse=university': 'Universitätsgelände',
  'atlas_landuse--title': 'Daten zur Landnutzung',
  'atlas_places--place--key': 'Ortskategorie',
  'atlas_places--place=borough': 'Stadtteil/Stadtbezirke',
  'atlas_places--place=city': 'Stadte',
  'atlas_places--place=hamlet': 'Siedlung',
  'atlas_places--place=suburb': 'Stadtteil',
  'atlas_places--place=town': 'Stadt oder große Gemeinde',
  'atlas_places--place=village': 'Dorf',
  'atlas_places--population--key': 'Einwohner:innen-Anzahl',
  'atlas_places--population:date--key': 'Datum der Quelle der Einwohner:innen-Anzahl',
  'atlas_places--title': 'Daten zu Orten',
  'atlas_poiClassification--amenity-fuel': 'Tankstelle',
  'atlas_poiClassification--amenity-pharmacy': 'Apotheke',
  'atlas_poiClassification--amenity-post_office': 'Post',
  'atlas_poiClassification--amenity-townhall': 'Rathaus/Gemeindeamt',
  'atlas_poiClassification--category--key': 'Kategorisierung des POI',
  'atlas_poiClassification--name--key': 'Name POI',
  'atlas_poiClassification--shop-bicycle': 'Fahrradladen',
  'atlas_poiClassification--shop-convenience': 'Minimarkt',
  'atlas_poiClassification--shop-supermarket': 'Supermarkt',
  'atlas_poiClassification--title': 'Daten zu Start-Ziel-Punkten',
  'atlas_poiClassification--tourism-hotel': 'Hotel',
  'atlas_poiClassification--type--key': 'Detail-Kategorie',
  'atlas_poiClassification--type=amenity-bank': 'Bank',
  'atlas_poiClassification--type=amenity-college': 'Weiterführende Schule',
  'atlas_poiClassification--type=amenity-doctors': 'Arzt',
  'atlas_poiClassification--type=amenity-fast_food': 'Imbiss',
  'atlas_poiClassification--type=amenity-kindergarten': 'Kindergarten',
  'atlas_poiClassification--type=amenity-place_of_worship': 'Kirche',
  'atlas_poiClassification--type=amenity-pub': 'Kneipe',
  'atlas_poiClassification--type=amenity-school': 'Schule',
  'atlas_poiClassification--type=amenity-university': 'Universität',
  'atlas_poiClassification--type=tourism-guest_house': 'Unterkunft (B&B)',
  'atlas_poiClassification--type=tourism-museum': 'Museum',
  'atlas_publicTransport--title': 'ÖPNV',
  'atlas_roads--bikelane_left=data_no': 'Keine Radinfrastruktur (explizit)',
  'atlas_roads--bikelane_left=missing': 'Unvollständig (keine Infrastruktur erkannt)',
  'atlas_roads--bikelane_left=not_expected': 'Vermutlich vollständig (keine Infrastruktur erwartet)',
  'atlas_roads--bikelane_right--key': 'Radfinfrastruktur Vollständigkeit Rechts (Linienrichtung)',
  'atlas_roads--bikelane_right=data_no': 'Keine Radinfrastruktur (explizit)',
  'atlas_roads--bikelane_right=missing': 'Unvollständig (keine Infrastruktur erkannt)',
  'atlas_roads--bikelane_right=not_expected': 'Vermutlich vollständig (keine Infrastruktur erwartet)',
  'atlas_roads--bikelane_self--key': 'Radfinfrastruktur Vollständigkeit Mittellinie',
  'atlas_roads--bikelane_self=data_no': 'Keine Radinfrastruktur (explizit)',
  'atlas_roads--bikelane_self=missing': 'Unvollständig (keine Infrastruktur erkannt)',
  'atlas_roads--bikelane_self=not_expected': 'Vermutlich vollständig (keine Infrastruktur erwartet)',
  'atlas_roads--bikelane_title': 'Daten zu Radfinfrastruktur Vollständigkeit der Führungsform',
  'atlas_roads--composit_lit--key': 'Beleuchtung',
  'atlas_roads--composit_maxspeed--key': 'Höchstgeschwindigkeit',
  'atlas_roads--composit_road_bikelanes--key': 'Radfinfrastruktur',
  'atlas_roads--lit--key': 'Beleuchtung Details',
  'atlas_roads--lit=no': 'Nicht beleuchtet',
  'atlas_roads--lit=special': 'Spezielle Angaben',
  'atlas_roads--lit=yes': 'Beleuchtet',
  'atlas_roads--maxspeed_source--key': 'Höchstgeschwindigkeit Quelle',
  'atlas_roads--maxspeed_source=inferred_from_highway': 'Abgeleitet vom `highway`-Tag.',
  'atlas_roads--maxspeed_source=maxspeed_tag': 'In OSM erfasst über einen `maxspeed`-Kategorie-Tag.',
  'atlas_roads--maxspeed_source=maxspeed': 'In OSM erfasst als Tag `maxspeed`.',
  'atlas_roads--maxspeed_source=zone': 'OSM-Zonen-Tag',
  'atlas_roads--osm_maxspeed:backward': 'Spezielle Höchstgeschwindigkeit gegen die Linienrichtung',
  'atlas_roads--osm_maxspeed:conditional': 'Spezielle Höchstgeschwindigkeit mit Einschränkungen',
  'atlas_roads--osm_maxspeed:forward': 'Spezielle Höchstgeschwindigkeit mit der Linienrichtung',
  'atlas_roads--osm_maxspeed:type--key': 'Höchstgeschwindigkeit Kategorie-Tag',
  'atlas_roads--osm_name--key': 'Name',
  'atlas_roads--osm_source:maxspeed--key': 'Höchstgeschwindigkeit Kategorie-Tag',
  'atlas_roads--osm_zone:maxspeed--key': 'Höchstgeschwindigkeit Kategorie-Tag',
  'atlas_roads--road_implicit_shared_lane=true': 'Führung im Mischverkehr',
  'atlas_roads--road_oneway--key': 'Fahrtrichtung',
  'atlas_roads--road_oneway:bicycle--key': 'Fahrtrichtung Fahrrad',
  'atlas_roads--road_oneway:bicycle=no': 'Freigabe für Radverkehr in beide Richtungen',
  'atlas_roads--road_oneway:bicycle=yes': 'Einbahnstraße auch für Radverkehr',
  'atlas_roads--road_oneway=no': 'Befahrbar in beide Richtungen',
  'atlas_roads--road_oneway=yes_dual_carriageway': 'Einbahnstraße da separate Geometrie pro Seite',
  'atlas_roads--road_oneway=yes': 'Einbahnstraße',
  'atlas_roads--road--key': 'Straßentyp',
  'atlas_roads--smoothness_source=mtb:scale_to_smoothness': 'Abgeleitet von dem OSM Wert `mtb:scale`',
  'atlas_roads--smoothness_source=surface_to_smoothness': 'Abgeleitet von dem Wert der Oberfläche über Standard-Werte',
  'atlas_roads--smoothness_source=tag': 'OSM-Tag `smoothness`',
  'atlas_roads--smoothness_source=tracktype_to_smoothness': 'Abgeleitet von dem OSM Wert `tracktype`',
  'atlas_roads--surface_source=tag': 'OSM-Tag `surface`',
  'atlas_roads--title': 'Daten zur Straße',
  'atlas_trafficSigns--title': 'Verkehrszeichen',
  'mapillary_coverage--title': 'Mapillary Foto',
}
