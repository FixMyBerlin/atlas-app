/* prettier-ignore */

// Legend:
// - "ALL--" stands for "all sources". Those translations are applied without checking the soureId
// - "ALL--category" is replaced with 'ALL--highway' in `ConditionalFormattedValue`
export const translations: { [key: string]: string } = {
  'ALL--category=bicycleRoad_vehicleDestination': 'Fahrradstraße mit Anlieger frei',
  'ALL--category=bicycleRoad': 'Fahrradstraße',
  'ALL--category=crossing': 'Straßenquerung',
  'ALL--category=cycleway_adjoining': 'Radweg (baulich von der Fahrbahn abgesetzt aber straßenbegleitend)',
  'ALL--category=cycleway_isolated': 'Radweg, frei geführt',
  'ALL--category=cycleway_isolatedOrIdjoining': 'Radweg (Straßenbegleitend oder frei geführt; Kategorisierung unklar)',
  'ALL--category=cyclewayLink': 'Radweg-Verbindungsstück. Häufig in OpenStreetMap verwendet um Routenfähiges Netz zu erzeugen; repräsentiert nur selten physische Infrastruktur.',
  'ALL--category=cyclewayOnHighway_advisory': 'Schutzstreifen',
  'ALL--category=cyclewayOnHighway_advisoryOrExclusive': 'Radfahrstreifen oder Schutzstreifen (Kategorisierung unklar)',
  'ALL--category=cyclewayOnHighway_exclusive': 'Radfahrstreifen',
  'ALL--category=cyclewayOnHighwayBetweenLanes': 'Radfahrstreifen in Mittellage (Fahrradweiche)',
  'ALL--category=footAndCyclewaySegregated_adjoining': 'Getrennter Rad- und Gehweg, straßenbegleitend',
  'ALL--category=footAndCyclewaySegregated_adjoiningOrIsolated': 'Getrennter Rad- und Gehweg (Straßenbegleitend oder frei geführt; Kategorisierung unklar)',
  'ALL--category=footAndCyclewaySegregated_isolated': 'Getrennter Rad- und Gehweg, frei geführt',
  'ALL--category=footAndCyclewayShared_adjoining': 'Gemeinsamer Geh- und Radweg, straßenbegleitend',
  'ALL--category=footAndCyclewayShared_adjoiningOrIsolated': 'Gemeinsamer Geh- und Radweg (Straßenbegleitend oder frei geführt; Kategorisierung unklar)',
  'ALL--category=footAndCyclewayShared_isolated': 'Gemeinsamer Geh- und Radweg, frei geführt',
  'ALL--category=footwayBicycleYes_adjoining': 'Gehweg mit Radwegfreigabe, straßenbegleitend',
  'ALL--category=footwayBicycleYes_adjoiningOrIsolated': 'Gehweg mit Radwegfreigabe (Straßenbegleitend oder frei geführt; Kategorisierung unklar)',
  'ALL--category=footwayBicycleYes_isolated': 'Gehweg mit Radwegfreigabe, frei geführt',
  'ALL--category=livingStreet': 'Verkehrsberuhigter Bereich (Spielstraße)',
  'ALL--category=needsClarification': 'Führungsform unklar. Die Attribute in OpenStreetMap sind nicht ausreichend, um die Führungsform zu kategorisieren. Das deutet darauf hin, dass zusätzlich Attribute in OSM ergänzt werden müssen.',
  'ALL--composit_surface_smoothness--key': 'Oberflächenqualität',
  'ALL--confidence=high': 'Hoch',
  'ALL--confidence=medium': 'Mittel',
  'ALL--fresh=fresh_check_at': 'Wert wurde in den letzten 2 Jahre überprüft und die Prüfung explizit vermerkt.',
  'ALL--fresh=fresh_update_at': 'Wert ist wahrscheinlich aktuell da die Attribute der Geometrie in den letzten 2 Jahren editiert wurden.',
  'ALL--fresh=outdated_check_at': 'Es wurde ein explizites Prüf-Datum erfasst das aber älter als 2 Jahre ist.',
  'ALL--fresh=outdated_update_at': 'Die Attribute dieser Geometrie wurden länger als 2 Jahre nicht bearbeitet.',
  'ALL--highway--key': 'Straßentyp',
  'ALL--highway=bicycle_road': 'Fahrradstraße', // roadClassification--category
  'ALL--highway=construction': 'Straße ist in Bau',
  'ALL--highway=cycleway': 'Radweg',
  'ALL--highway=footway': 'Fußweg',
  'ALL--highway=living_street': 'Verkehrsberuhigter Bereich',
  'ALL--highway=path': 'Weg / Pfad',
  'ALL--highway=pedestrian': 'Fußgängerzone',
  'ALL--highway=primary': 'Bundesstraße/Hauptverbindungsstraße',
  'ALL--highway=residential': 'Anwohnerstraße',
  'ALL--highway=secondary': 'Landesstraße/Wichtige Durchgangsstraße',
  'ALL--highway=service_alley': 'Gasse', // roadClassification--category
  'ALL--highway=service_driveway': 'Grundstückszufahrt', // roadClassification--category
  'ALL--highway=service_parking_aisle': 'Parkplatzweg', // roadClassification--category
  'ALL--highway=service_road': 'Zufahrtsweg', // roadClassification--category
  'ALL--highway=service': 'Zufahrtsweg',
  'ALL--highway=steps': 'Stufen',
  'ALL--highway=tertiary': 'Kreisstraße/Untergeordnete Durchgangsstraße',
  'ALL--highway=track': 'Wald- / Feldweg',
  'ALL--highway=unclassified': 'Nebenstraße mit Verbindungscharakter',
  'ALL--highway=unspecified_road_category': 'Unkategorisierte Straße', // roadClassification--category
  'ALL--maxspeed--key': 'Höchstgeschwindigkeit',
  'ALL--name--key': 'Name',
  'ALL--oneway--key': 'Fahrtrichtung',
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
  'ALL--traffic_sign--key': 'Verkehrszeichen',
  'ALL--traffic_sign=none': 'Unbeschildert',
  'ALL--width--key': 'Breite',
  'atlas_bicycleParking--capacity--key': 'Anzahl Fahrrad-Stellplätze',
  'atlas_bicycleParking--capacity:cargo_bike--key': 'Anzahl Lastenfahrrad-Stellplätze',
  'atlas_bicycleParking--title': 'Fahrradstellplätze',
  'atlas_bikelanes--category--key': 'Führungsform',
  'atlas_bikelanes--category=pedestrianAreaBicycleYes': 'Fußgängerzone, Fahrrad frei',
  'atlas_bikelanes--category=sharedBusLane': 'Gemeinsamer Fahrstreifen mti Bussen',
  'atlas_bikelanes--category=sharedMotorVehicleLane': 'Gemeinsamer Fahrstreifen mit Kfz',
  'atlas_bikelanes--composit_highway--key': 'Straßentyp',
  'atlas_bikelanes--oneway=car_not_bike': 'Einbahnstraße für Kfz aber Zweirichtungsradwege',
  'atlas_bikelanes--oneway=implicit_no': 'Zweirichtungsradweg (implizite Angabe)',
  'atlas_bikelanes--oneway=implicit_yes': 'Einrichtungsradweg (implizite Angabe)',
  'atlas_bikelanes--oneway=no': 'Zweirichtungsradwege',
  'atlas_bikelanes--oneway=yes': 'Einrichtungsradweg',
  'atlas_bikelanes--title': 'Daten zur Radinfrastruktur',
  'atlas_bikelanes--smoothness_source=tag': 'OSM-Tag `smoothness`',
  'atlas_bikelanes--smoothness_source=surface_to_smoothness': 'Abgeleitet von dem Wert der Oberfläche über Standard-Werte',
  'atlas_bikelanes--surface_source=tag': 'OSM-Tag `surface`',
  'atlas_bikelanesPresence--left--key': 'Vollständigkeit Links (Linienrichtung)',
  'atlas_bikelanesPresence--left=data_no': 'Keine Radinfrastruktur (explizit)',
  'atlas_bikelanesPresence--left=missing': 'Unvollständig (keine Infrastruktur erkannt)',
  'atlas_bikelanesPresence--left=not_expected': 'Vermutlich vollständig (keine Infrastruktur erwartet)',
  'atlas_bikelanesPresence--oneway=implicit_yes': 'Einrichtungsradweg (implizite Angabe)',
  'atlas_bikelanesPresence--oneway=no': 'Zweirichtungsradwege',
  'atlas_bikelanesPresence--oneway=yes': 'Einrichtungsradweg',
  'atlas_bikelanesPresence--right--key': 'Vollständigkeit Rechts (Linienrichtung)',
  'atlas_bikelanesPresence--right=data_no': 'Keine Radinfrastruktur (explizit)',
  'atlas_bikelanesPresence--right=missing': 'Unvollständig (keine Infrastruktur erkannt)',
  'atlas_bikelanesPresence--right=not_expected': 'Vermutlich vollständig (keine Infrastruktur erwartet)',
  'atlas_bikelanesPresence--self--key': 'Vollständigkeit Mittellinie',
  'atlas_bikelanesPresence--self=data_no': 'Keine Radinfrastruktur (explizit)',
  'atlas_bikelanesPresence--self=missing': 'Unvollständig (keine Infrastruktur erkannt)',
  'atlas_bikelanesPresence--self=not_expected': 'Vermutlich vollständig (keine Infrastruktur erwartet)',
  'atlas_boundaries--admin_level--key': 'Grenzen Level',
  'atlas_boundaries--admin_level=7': 'Level 7 — Meistens Verwaltungsgemeinschaft, Amt', // https://wiki.openstreetmap.org/wiki/DE:Grenze
  'atlas_boundaries--admin_level=8': 'Level 8 — Meistens (Kreisangehörige) Gemeinde / Stadt',
  'atlas_boundaries--title': 'Grenzen',
  'atlas_buildings--building--key': 'Gebäudeart',
  'atlas_buildings--building=garage': 'Garage (einzeln)',
  'atlas_buildings--building=garages': 'Mehrere Garagen',
  'atlas_buildings--building=retail': 'Gebäude des Einzelhandels',
  'atlas_buildings--title': 'Gebäude',
  'atlas_education--amenity--key': 'Art der Bildngseinrichtung',
  'atlas_education--amenity=kindergarten': 'Kindergarten',
  'atlas_education--amenity=school': 'Schule',
  'atlas_education--title': 'Daten zu Bildungseinrichtungen',
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
  'atlas_lit--category--key': 'Beleuchtung',
  'atlas_lit--category=lit': 'Beleuchtet',
  'atlas_lit--category=special': 'Spezielle Angaben',
  'atlas_lit--category=unlit': 'Nicht beleuchtet',
  'atlas_lit--lit--key': 'Beleuchtung Details',
  'atlas_lit--lit=no': 'Nicht beleuchtet',
  'atlas_lit--lit=yes': 'Beleuchtet',
  'atlas_lit--title': 'Daten zur Beleuchtung',
  'atlas_maxspeed--maxspeed_source--key': 'Quelle',
  'atlas_maxspeed--maxspeed_source=inferred_from_highway': 'Abgeleitet vom `highway`-Tag.',
  'atlas_maxspeed--maxspeed_source=maxspeed_tag': 'In OSM explizit erfasst.',
  'atlas_maxspeed--maxspeed_source=maxspeed': 'In OSM erfasst als Tag `maxspeed`.',
  'atlas_maxspeed--maxspeed:backward': 'Spezielle Höchstgeschwindigkeit gegen die Linienrichtung',
  'atlas_maxspeed--maxspeed:conditional': 'Spezielle Höchstgeschwindigkeit mit Einschränkungen',
  'atlas_maxspeed--maxspeed:forward': 'Spezielle Höchstgeschwindigkeit mit der Linienrichtung',
  'atlas_maxspeed--maxspeed:type--key': 'Kategorie-Tag',
  'atlas_maxspeed--source:maxspeed--key': 'Kategorie-Tag',
  'atlas_maxspeed--title': 'Daten zur Höchstgeschwindigkeit',
  'atlas_maxspeed--zone:maxspeed--key': 'Kategorie-Tag',
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
  'atlas_poiClassification--type=amenity-doctors': 'Arzt',
  'atlas_poiClassification--type=amenity-fast_food': 'Imbiss',
  'atlas_poiClassification--type=amenity-kindergarten': 'Kindergarten',
  'atlas_poiClassification--type=amenity-place_of_worship': 'Kirche',
  'atlas_poiClassification--type=amenity-pub': 'Kneipe',
  'atlas_poiClassification--type=amenity-school': 'Schule',
  'atlas_poiClassification--type=tourism-guest_house': 'Unterkunft (B&B)',
  'atlas_poiClassification--type=tourism-museum': 'Museum',
  'atlas_publicTransport--title': 'ÖPNV',
  'atlas_roadClassification--category--key': 'Straßentyp',
  'atlas_roadClassification--oneway=car_and_bike_dual_carriageway': 'Einbahnstraße aufgrund getrennt erfasster Fahrspuren für Kfz- und Radverkehr',
  'atlas_roadClassification--oneway=car_and_bike': 'Einbahnstraße für Kfz- und Radverkehr',
  'atlas_roadClassification--oneway=car_not_bike_dual_carriageway': 'Einbahnstraße aufgrund getrennt erfasster Fahrspuren für Kfz aber Zweirichtungsradweg',
  'atlas_roadClassification--oneway=car_not_bike': 'Einbahnstraße für Kfz aber Zweirichtungsradweg',
  'atlas_roadClassification--title': 'Daten zu Straßentypen',
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
  'atlas_roads--lit=no': 'Nicht beleuchtet',
  'atlas_roads--lit=special': 'Spezielle Angaben',
  'atlas_roads--lit=yes': 'Beleuchtet',
  'atlas_roads--maxspeed_source--key': 'Höchstgeschwindigkeit Quelle',
  'atlas_roads--maxspeed_source=inferred_from_highway': 'Abgeleitet vom `highway`-Tag.',
  'atlas_roads--maxspeed_source=maxspeed_tag': 'In OSM erfasst über einen `maxspeed`-Kategorie-Tag.',
  'atlas_roads--maxspeed_source=maxspeed': 'In OSM erfasst als Tag `maxspeed`.',
  'atlas_roads--maxspeed_source=zone': 'OSM-Zonen-Tag',
  'atlas_roads--osm_lit--key': 'Beleuchtung Details',
  'atlas_roads--osm_lit=no': 'Nicht beleuchtet',
  'atlas_roads--osm_lit=yes': 'Beleuchtet',
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
  'atlas_roads--smoothness_source=surface_to_smoothness': 'Abgeleitet von dem Wert der Oberfläche über Standard-Werte',
  'atlas_roads--smoothness_source=tag': 'OSM-Tag `smoothness`',
  'atlas_roads--surface_source=tag': 'OSM-Tag `surface`',
  'atlas_roads--title': 'Daten zur Straße',
  'atlas_trafficSigns--title': 'Verkehrszeichen',
  'bietigheim-bissingen_on_street_parking_lines--condition_class--key': 'Parkbeschränkungen',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=access_restriction': 'Zugangsbeschränkung (z.B. privat, nur für Kunden oder Rettungsfahrzeuge)',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=car_sharing': 'Nur für Carsharing-Fahrzeuge',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=charging': 'Laden von Elektrofahrzeugen',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=disabled_private': 'Behindertenparkplatz mit Parkausweis',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=disabled': 'Behindertenparkplatz',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=free': 'Keine Parkbeschränkungen',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=loading': 'Ladezone',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=mixed': 'Mit Bewohnerparkausweis oder Parkschein',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=no_parking': 'Parkverbot / Eingeschränktes Haltverbot',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=no_stopping': 'Halteverbot / Absolutes Haltverbot',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=paid': 'Nur mit Parkschein',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=residents': 'Nur mit Bewohnerparkausweis',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=taxi': 'Taxenstand',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=time_limited': 'zeitliche Beschränkung (Parkscheibe)',
  'bietigheim-bissingen_on_street_parking_lines--condition_class=vehicle_restriction': 'Beschränkung auf/Verbot für ausgewiesene Fahrzeugklassen (spezifiziert durch Attribute „vehicle_designated“ und „vehicle_excluded“)',
  'bietigheim-bissingen_on_street_parking_lines--highway:name--key': 'Name',
  'bietigheim-bissingen_on_street_parking_lines--markings--key': 'Straßenmarkierungen',
  'bietigheim-bissingen_on_street_parking_lines--markings=no': 'Keine Straßenmarkierungen im Parkbereich',
  'bietigheim-bissingen_on_street_parking_lines--markings=yes': 'Parkbereich mit Straßenmarkierungen',
  'bietigheim-bissingen_parking_areas--informal--key': 'Geduldet',
  'bietigheim-bissingen_parking_areas--informal=yes': 'Ja',
  'bietigheim-bissingen_parking_areas--markings=no': 'Keine Straßenmarkierungen im Parkbereich',
  'bietigheim-bissingen_parking_areas--markings=yes': 'Parkbereich mit Straßenmarkierungen',
  'bietigheim-bissingen_parking_areas--maxstay--key': 'Höchstparkdauer',
  'bietigheim-bissingen_parking_areas--maxstay:conditional--key': 'Höchstparkdauer mit Bedingungen',
  'bietigheim-bissingen_parking_areas--parking:levels--key': 'Stockwerke',
  'mapillary_coverage--title': 'Mapillary Foto',
  'parkraumParking--capacity_status--key': 'Vollständigkeit',
  'parkraumParking--capacity_status=data_missing': 'Daten fehlen – bisher wurden noch keine Daten in OSM hinterlegt',
  'parkraumParking--capacity_status=no_parking': 'Daten erfasst (Parken verboten)',
  'parkraumParking--capacity_status=not_processed_yet': 'Daten fehlen – Prozessierung in Arbeit',
  'parkraumParking--capacity_status=other': 'Daten erfasst',
  'parkraumParking--capacity_status=segment_too_small': 'Daten erfasst und prozessiert aber Segment zu klein für einen Parkstand',
  'parkraumParking--capacity--key': 'Stellplatzanzahl',
  'parkraumParking--highway_name--key': 'Straßenname',
  'parkraumParking--highway_width_proc_effective--key': 'Nutzbare Fahrbahnbreite',
  'parkraumParking--length--key': 'Länge',
  'parkraumParking--operator_type--key': 'Rechtliche Zuordnung',
  'parkraumParking--operator_type=private': 'Privat',
  'parkraumParking--operator_type=public': 'Öffentlich',
  'parkraumParking--orientation--key': 'Ausrichtung',
  'parkraumParking--orientation=diagonal': 'Schrägparken',
  'parkraumParking--orientation=no': '(!) Kein Parken',
  'parkraumParking--orientation=parallel': 'Parallelparken',
  'parkraumParking--orientation=perpendicular': 'Querparken',
  'parkraumParking--parking--key': 'Art des Parkens',
  'parkraumParking--parking=lane': 'Auf der Fahrbahn',
  'parkraumParking--parking=street_side': 'Parkbucht',
  'parkraumParking--position--key': 'Position',
  'parkraumParking--position=half_on_kerb': 'Halb auf dem Gehweg',
  'parkraumParking--position=lane': 'Auf der Fahrbahn',
  'parkraumParking--position=no': 'Park- oder Halteverbot (implizit oder Beschildert)',
  'parkraumParking--position=on_kerb': 'Auf dem Gehweg',
  'parkraumParking--position=separate': 'Parkstand als separate Geometrie erfasst; Detailattribute bitte an der separaten Geometrie ablesen.',
  'parkraumParking--position=shoulder': 'Seitenstreifen',
  'parkraumParking--position=street_side': 'Parkbucht',
  'parkraumParking--source_capacity--key': 'Quelle Stellplatzanzahl',
  'parkraumParking--source_capacity=estimated': 'Interpolation',
  'parkraumParking--source_capacity=OSM': 'Explizit in OSM erfasst',
  'parkraumParking--surface--key': 'Oberfläche',
  'parkraumParking--title': 'Parkraum',
  'parkraumParkingAreas--access--key': 'Zugang',
  'parkraumParkingAreas--access=customers': 'Kund:innen',
  'parkraumParkingAreas--access=destination': 'Anlieger frei (Nicht-Durchgangsverkehr erlaubt)',
  'parkraumParkingAreas--access=no': 'Beschränkt',
  'parkraumParkingAreas--access=permissive': 'Geduldet',
  'parkraumParkingAreas--access=private': 'Privat',
  'parkraumParkingAreas--access=yes': 'Öffentlich',
  'parkraumParkingAreas--building--key': 'Gebäudeart',
  'parkraumParkingAreas--building=carport': 'Carport',
  'parkraumParkingAreas--building=garage': 'Garage',
  'parkraumParkingAreas--building=garages': 'Garagen',
  'parkraumParkingAreas--building=parking': 'Parkhaus',
  'parkraumParkingAreas--building=supermarket': 'Supermarkt',
  'parkraumParkingAreas--capacity--key': 'Kapazität (Explizit, OSM)',
  'parkraumParkingAreas--description--key': 'Freitextnotizen aus OSM',
  'parkraumParkingAreas--fee--key': 'Gebühr',
  'parkraumParkingAreas--fee=no': 'Keine Gebühr',
  'parkraumParkingAreas--fee=yes': 'Geführenpflichtig',
  'parkraumParkingAreas--markings--key': 'Markierung',
  'parkraumParkingAreas--operator_type--key': 'Betreiber (Kategorie)',
  'parkraumParkingAreas--operator--key': 'Betreiber',
  'parkraumParkingAreas--orientation--key': 'Ausrichtung',
  'parkraumParkingAreas--orientation=diagonal': 'Schrägparken',
  'parkraumParkingAreas--orientation=parallel': 'Parallelparken',
  'parkraumParkingAreas--orientation=perpendicular': 'Querparken',
  'parkraumParkingAreas--parking--key': 'Art',
  'parkraumParkingAreas--parking=carport': 'Carport',
  'parkraumParkingAreas--parking=carports': 'Carport',
  'parkraumParkingAreas--parking=garage_boxes': 'Garagen',
  'parkraumParkingAreas--parking=lane': 'Parken auf der Fahrbahn',
  'parkraumParkingAreas--parking=multi-storey': 'Parkhaus',
  'parkraumParkingAreas--parking=rooftop': 'Dachebene',
  'parkraumParkingAreas--parking=street_side': 'Parkbucht/Parktasche/Parkhafen',
  'parkraumParkingAreas--parking=surface': 'Flächenparkplatz',
  'parkraumParkingAreas--parking=underground': 'Tiefgarage',
  'parkraumParkingAreas--surface--key': 'Oberfläche',
  'parkraumParkingAreas--title': 'Parkplatz-Flächen',
  'parkraumParkingStats--admin_level--key': 'Grenzen Level',
  'parkraumParkingStats--d_other_km--key': 'Straßen-km "Sonstiges"',
  'parkraumParkingStats--done_percent--key': 'Stand Erfassung Parkraum',
  'parkraumParkingStats--half_on_kerb_km--key': 'Straßen-km parken halb auf dem Gehweg',
  'parkraumParkingStats--lane_km--key': 'Straßen-km parken auf der Fahrbahn',
  'parkraumParkingStats--length_wo_dual_carriageway--key': 'Straßen-km (alle Attribute) ohne Filterung von zweispurig erfassten Fahrbahnen ("dual_carriageway")',
  'parkraumParkingStats--on_kerb_km--key': 'Straßen-km parken auf dem Gehweg',
  'parkraumParkingStats--street_side_km--key': 'Straßen-km parken in Parkbuchten',
  'parkraumParkingStats--sum_km--key': 'Straßen-km (alle Attribute)',
  'parkraumParkingStats--title': 'Statisik zum Parkraum',
  // 'ALL--oneway=-1': 'Entgegen der Einbahnstraße freigegeben', // this should not exist anymore(?)
}
