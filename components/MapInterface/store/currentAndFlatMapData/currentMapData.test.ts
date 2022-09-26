import { MapDataConfigTopic } from '../../Map/mapData'
import { currentAndFlatMapDataForConfig } from './currentAndFlatMapData'

describe('_currentMapData()', () => {
  const fakeMapDataConfigTopics: MapDataConfigTopic[] = [
    {
      id: 'boundaries',
      name: '',
      desc: '',
      sourceId: 'unfallatlas',
      visible: false,
      styles: [
        {
          id: 'default',
          name: 'Standard',
          desc: null,
          visible: true,
          layers: [
            {
              id: 'circle',
              type: 'circle',
              'source-layer': 'foo',
              filter: [],
              paint: undefined,
              enableInspector: true,
              enableCalculator: false,
            },
          ],
          interactiveFilters: null,
        },
      ],
    },
    {
      id: 'accidents',
      name: '',
      desc: '',
      sourceId: 'unfallatlas',
      visible: false,
      styles: [
        {
          id: 'default',
          name: 'Standard',
          desc: null,
          visible: true,
          layers: [
            {
              id: 'circle',
              type: 'circle',
              'source-layer': 'foo',
              filter: [],
              paint: undefined,
              enableInspector: true,
              enableCalculator: false,
            },
          ],
          interactiveFilters: [
            {
              id: 'years',
              name: 'Jahre',
              filterConfig: { lookupKey: 'FOO' },
              inputType: 'checkbox',
              options: [
                { id: 'foo1', name: 'FOO1' },
                { id: 'foo2', name: 'FOO2', default: true },
                { id: 'foo3', name: 'FOO3', default: true },
              ],
            },
          ],
        },
      ],
    },
  ]

  const fakeInput = {
    thatMapDataConfigTopics: fakeMapDataConfigTopics,
    selectedTopicIds: ['accidents'],
    selectedStyleKeys: ['accidents-default'],
    selectedStylesFilterOptionKeys: ['accidents-default-years-2017'],
  }

  it('Topics: Shows only current in flatMapData format', () => {
    const currentAndFlatMap = currentAndFlatMapDataForConfig(fakeInput as any)
    const result = currentAndFlatMap.topics
    expect(result.length).toStrictEqual(1)
    expect(result[0].id).toStrictEqual('accidents')
  })

  it('Styles: Shows only current in flatMapData format', () => {
    const currentAndFlatMap = currentAndFlatMapDataForConfig(fakeInput as any)
    const result = currentAndFlatMap.styles
    expect(result.length).toStrictEqual(1)
    expect(result[0].id).toStrictEqual('default')
  })

  it('Styles: Returns none if selected key not found (error case)', () => {
    const currentAndFlatMap = currentAndFlatMapDataForConfig({
      ...fakeInput,
      ...{ selectedStyleKeys: ['foo'] },
    } as any)
    const result = currentAndFlatMap.styles
    expect(result.length).toStrictEqual(0)
  })
})
