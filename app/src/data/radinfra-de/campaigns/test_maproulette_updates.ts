import { CampaignType } from '../schema/campaignsSchema'

export const test_maproulette_updates: CampaignType = {
  id: 'test_maproulette_updates',
  title: 'Test Kampagne um MapRoulette Funktionen zu testen',
  pubDate: new Date('2025-01-01T15:00'),
  category: 'radinfra',
  recommendedAction: 'maproulette',
  visibility: 'hidden',
  description:
    'Mit dieser Kampagne test ich, wie sich MapRoulette verhält, wenn sich Daten extern ändern.',
  task: 'Hier gibt es nihts zu tun.',
  mapUrl: 'https://tilda-geo.de/regionen/radinfra?config=',
  maprouletteChallenge: {
    enabled: true,
    id: 50884,
    checkinComment: '#radinfra_de #maproulette',
    checkinSource: 'radinfra_de',
    resultsLimited: false,
  },
  taskTemplate: ``,
}
