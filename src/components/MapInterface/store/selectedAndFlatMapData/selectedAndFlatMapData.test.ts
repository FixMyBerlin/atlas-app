import { MapDataConfigTopic } from '../../mapData'
import { selectedAndFlatMapDataForConfig } from './selectedAndFlatMapData'

describe('selectedAndFlatMapDataForConfig()', () => {
  const fakeMapDataConfigTopics: MapDataConfigTopic[] = [
    {
      id: 'boundaries',
      name: '',
      desc: '',
      sourceId: 'unfallatlas',
      defaultVisible: false,
      styles: [
        {
          id: 'default',
          name: 'Standard',
          desc: null,
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
      defaultVisible: false,
      styles: [
        {
          id: 'default',
          name: 'Standard',
          desc: null,
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
                { id: 'foo2', name: 'FOO2', defaultActive: true },
                { id: 'foo3', name: 'FOO3', defaultActive: true },
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
    const selectedAndFlatMap = selectedAndFlatMapDataForConfig(fakeInput as any)
    const result = selectedAndFlatMap.topics
    expect(result.length).toStrictEqual(1)
    expect(result[0].id).toStrictEqual('accidents')
  })

  it('Styles: Shows only current in flatMapData format', () => {
    const selectedAndFlatMap = selectedAndFlatMapDataForConfig(fakeInput as any)
    const result = selectedAndFlatMap.styles
    expect(result.length).toStrictEqual(1)
    expect(result[0].id).toStrictEqual('default')
  })

  it('Styles: Returns none if selected key not found (error case)', () => {
    const selectedAndFlatMap = selectedAndFlatMapDataForConfig({
      ...fakeInput,
      ...{ selectedStyleKeys: ['foo'] },
    } as any)
    const result = selectedAndFlatMap.styles
    expect(result.length).toStrictEqual(0)
  })
})
