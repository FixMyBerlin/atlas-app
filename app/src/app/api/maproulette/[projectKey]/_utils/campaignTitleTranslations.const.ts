import { TodoId } from '@/src/processingTypes/todoId'

export const campaignTitleTranslations: Record<TodoId, string> = {
  // Bikelanes
  adjoiningOrIsolated: 'Straßenbegleitend oder selbstständig geführt?',
  advisoryOrExclusive: 'Schutzstreifen oder Angebotsstreifen?',
  missing_access_tag_240: 'Zugangs-Tagging fehlt (Geh-/Radweg)', // Gem./Getr. Geh-/Radweg aber kein bicycle+foot=designated
  missing_access_tag_bicycle_road: 'Zugangs-Tagging fehlt (Fahrradstraße)',
  missing_segregated: 'Gemeinsame oder getrennte Führung?',
  missing_traffic_sign: 'Fehlendes Verkehrszeichen',
  missing_traffic_sign_244: 'Fehlendes Verkehrszeichen (Fahradstraße)',
  missing_traffic_sign_but_bicycle_designated: 'Fehlendes Verkehrszeichen (`bicycle=designated`)',
  missing_traffic_sign_but_bicycle_yes: 'Fehlendes Verkehrszeichen (`bicycle=yes`)',
  missing_traffic_sign_vehicle_destination: 'Fehlendes Verkehrszeichen (Anlieger frei)',
  needsClarification: 'Führungsform unklar',
  unexpected_bicycle_access_on_footway: 'Straßenklasse unklar (Fußweg)',
  // Roads
  deprecated_cycleway_shared: 'Veraltetes Tagging (`shared`)',
}
