import {
  Link,
  Navigate,
  useMatch,
  useNavigate,
  useSearch,
} from '@tanstack/react-location'
import { useEffect } from 'react'
import { MapInterface } from '../../components/MapInterface'
import { MapDataConfigTopicsWithState } from '../../components/MapInterface/store/mapDataConfigTopicsWithState'
import { LocationGenerics } from '../../routes'
import { TestTopics } from './test'

export const PageRegionMap: React.FC = () => {
  const {
    data: { region },
    params: { regionPath },
  } = useMatch()

  if (region === undefined) {
    return (
      <Navigate to="/regionen" search={{ regionPathNotFound: regionPath }} />
    )
  }

  const navigate = useNavigate<LocationGenerics>()
  const { theme, lat, lng, zoom, config } = useSearch<LocationGenerics>()

  const testConfig = (a1 = true, a2 = true): MapDataConfigTopicsWithState => {
    return [
      {
        id: 'bikelanes',
        active: a1,
        styles: [
          {
            id: 'default',
            active: a2,
            filters: [
              {
                id: 'years',
                options: [
                  {
                    id: 'fo1',
                    active: true as boolean,
                  },
                  {
                    id: 'fo2',
                    active: false as boolean,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'surface',
        active: a1,
        styles: [
          {
            id: 'default',
            active: a2,
            filters: null,
          },
          {
            id: 'presence',
            active: false,
            filters: null,
          },
        ],
      },
    ]
  }

  useEffect(() => {
    if (theme && lat && lng && zoom && config) return

    navigate({
      search: (old) => {
        return {
          lat: old?.lat ?? 52.4793,
          lng: old?.lng ?? 13.4381,
          zoom: old?.zoom ?? 16,
          theme: old?.theme ?? 'surface',
          config: testConfig(),
        }
      },
      replace: true,
    })
  }, [theme, lat, lng, zoom, config])

  const moveMap = ({
    lat,
    lng,
    zoom,
  }: {
    lat: number
    lng: number
    zoom: number
  }) => {
    navigate({
      search: (old) => {
        return { ...old, lat, lng, zoom }
      },
    })
  }

  const updateConfig = ({
    config,
  }: {
    config: MapDataConfigTopicsWithState
  }) => {
    navigate({
      search: (old) => {
        return { ...old, config }
      },
    })
  }

  return (
    <div className="">
      <h1>
        MAP <pre className="inline">{regionPath}</pre>:{' '}
      </h1>
      <Link to={`/regionen/${regionPath}`} className="m-1 rounded border p-1">
        Retest defaults
      </Link>
      <button
        className="m-1 rounded border p-1"
        onClick={() =>
          moveMap({
            lat: Math.random(),
            lng: Math.random(),
            zoom: Math.random(),
          })
        }
      >
        Move Map
      </button>
      <button
        className="m-1 rounded border p-1"
        onClick={() => updateConfig({ config: testConfig(false, false) })}
      >
        Change config
      </button>
      <div>
        <TestTopics />
      </div>
      <div className="grid h-96 grid-cols-3 gap-4">
        <MapInterface />
        <pre className="overflow-scroll border text-xs">
          {JSON.stringify({ region, theme, lat, lng, zoom }, undefined, 2)}
        </pre>
        <pre className="overflow-scroll border text-xs">
          {JSON.stringify({ config }, undefined, 2)}
        </pre>
      </div>
    </div>
  )
}
