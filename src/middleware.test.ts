import { NextRequest } from 'next/server'
import { describe, expect, test } from 'vitest'
import { middleware } from './middleware'
import { parseMapParam } from './app/regionen/[regionSlug]/_hooks/useQueryState/utils/mapParam'

function getStatus(response: ReturnType<typeof middleware>) {
  // @ts-expect-error response is not type correctly
  return response.status
}

function getUrl(response: ReturnType<typeof middleware>) {
  // @ts-expect-error response is not type correctly; could not find docs or a github ticket on this
  return new URL(response.headers.get('location'))
}

describe('middleware()', () => {
  test('NextJS middleware Bug that changes local IP URL ot localhost', () => {
    // Ideally this test will fail soon so we can cleanup the workaround in <DevMiddlewareHostnameWorkaround> and in the auth config.
    // More in src/app/regionen/[regionSlug]/_components/DevMiddlewareHostnameWorkaround.tsx
    const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/berlin')
    const response = middleware(mockRequest)!
    const url = getUrl(response)
    expect(url.host).toBe('localhost:5173')
  })

  describe('Make sure the guards work', () => {
    test('Do nothing on home', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/')
      const response = middleware(mockRequest)
      expect(getStatus(response)).toBe(200)
    })

    test('Do nothing if path does not start with "/regionen"', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/somethingelse')
      const response = middleware(mockRequest)
      expect(getStatus(response)).toBe(200)
    })

    test('Do nothing on /regionen', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen')
      const response = middleware(mockRequest)
      expect(getStatus(response)).toBe(200)
    })

    test('Do nothing on subpages of the map /regionen/:slug/foo', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/berlin/foo')
      const response = middleware(mockRequest)
      expect(getStatus(response)).toBe(200)
    })

    test('Do nothing when region is unknown', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/unkownRegion')
      const response = middleware(mockRequest)
      expect(getStatus(response)).toBe(200)
    })
  })

  describe('Make we migrate and redirect renamed regions', () => {
    test('Redirect when matching a renamed region and apply map params', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/bb-ag?theme=foobar')
      const response = middleware(mockRequest)
      const url = getUrl(response)

      // Migrated region
      expect(url.pathname).toBe('/regionen/bb-pg')
      // But still handling the map params
      expect(typeof url.searchParams.get('map')).toBe('string')
      expect(typeof url.searchParams.get('config')).toBe('string')
    })

    test('Redirect subpage when matching a renamed region', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/bb-ag/foobar')
      const response = middleware(mockRequest)
      const url = getUrl(response)

      expect(url.pathname).toBe('/regionen/bb-pg/foobar')
    })
  })

  describe('Make sure the redirects work for /regionen/:slug', () => {
    test('INIT: Add missing map, config params', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/berlin')
      const response = middleware(mockRequest)
      const url = getUrl(response)

      expect(typeof url.searchParams.get('map')).toBe('string')
      expect(typeof url.searchParams.get('config')).toBe('string')
    })

    test('MIGRATION: Migrate `lat`, `lng`, `zoom` params to `map` param', () => {
      const mockRequest = new NextRequest(
        'http://127.0.0.1:5173/regionen/berlin?lat=1&lng=2&zoom=3',
      )
      const response = middleware(mockRequest)
      const url = getUrl(response)

      expect(url.searchParams.get('map')).toBe('3/1/2')
      expect(url.searchParams.getAll('map').length).toBe(1)
      expect(url.searchParams.get('lat')).toBe(null)
      expect(url.searchParams.get('lng')).toBe(null)
      expect(url.searchParams.get('zoom')).toBe(null)
    })

    test('MIGRATION: Migrate `lat`, `lng` to `map` param', () => {
      const mockRequest = new NextRequest('http://127.0.0.1:5173/regionen/berlin?lat=1&lng=2')
      const response = middleware(mockRequest)
      const url = getUrl(response)

      expect(url.searchParams.get('map')).toBe('12.1/1/2') // using mapParamFallback.zoom
      expect(url.searchParams.getAll('map').length).toBe(1)
      expect(url.searchParams.get('lat')).toBe(null)
      expect(url.searchParams.get('lng')).toBe(null)
      expect(url.searchParams.get('zoom')).toBe(null)
    })

    test('MIGRATION: Migrate `lat`, `lng` to `map` param but not if map is present', () => {
      const mockRequest = new NextRequest(
        'http://127.0.0.1:5173/regionen/berlin?lat=1&lng=2&map=5/6/7',
      )
      const response = middleware(mockRequest)
      const url = getUrl(response)

      expect(url.searchParams.get('map')).toBe('5/6/7')
      expect(url.searchParams.getAll('map').length).toBe(1)
      expect(url.searchParams.get('lat')).toBe(null)
      expect(url.searchParams.get('lng')).toBe(null)
      expect(url.searchParams.get('zoom')).toBe(null)
    })

    const sharedMockMigrationRequest = new NextRequest(
      'http://127.0.0.1:5173/regionen/berlin?config=!(i~fromTo~a~~topics~!(i~shops~s~!(i~hidden~a)(i~default~a~_F))(i~education~s~!(i~hidden~a)(i~default~a~_F))(i~places~s~!(i~hidden~a~_F)(i~default~a)(i~circle~a~_F))(i~buildings~s~!(i~hidden~a)(i~default~a~_F))(i~landuse~s~!(i~hidden~a~_F)(i~default~a))(i~barriers~s~!(i~hidden~a~_F)(i~default~a))(i~boundaries~s~!(i~hidden~a)(i~default~a~_F)(i~level-8~a~_F)(i~level-9-10~a~_F)))(i~bikelanes~a~~topics~!(i~bikelanes~s~!(i~hidden~a~_F)(i~default~a)(i~verification~a~_F)(i~completeness~a~_F)(i~bikelane*_oneway*_arrows~a~_F))(i~bikelanesPresence*_legacy~s~!(i~hidden~a)(i~default~a~_F))(i~places~s~!(i~hidden~a~_F)(i~default~a)(i~circle~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))(i~roadClassification~a~_F~topics~!(i~roadClassification*_legacy~s~!(i~hidden~a~_F)(i~default~a)(i~oneway~a~_F))(i~bikelanes~s~!(i~hidden~a)(i~default~a~_F)(i~verification~a~_F)(i~completeness~a~_F)(i~bikelane*_oneway*_arrows~a~_F))(i~maxspeed*_legacy~s~!(i~hidden~a)(i~default~a~_F)(i~details~a~_F))(i~surfaceQuality*_legacy~s~!(i~hidden~a)(i~default~a~_F)(i~bad~a~_F)(i~completeness~a~_F)(i~freshness~a~_F))(i~places~s~!(i~hidden~a~_F)(i~default~a)(i~circle~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))(i~lit~a~_F~topics~!(i~lit*_legacy~s~!(i~hidden~a~_F)(i~default~a)(i~completeness~a~_F)(i~freshness~a~_F))(i~places~s~!(i~hidden~a)(i~default~a~_F)(i~circle~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))(i~parking~a~_F~topics~!(i~parking~s~!(i~hidden~a~_F)(i~default~a)(i~presence~a~_F)(i~surface~a~_F))(i~parkingPoints~s~!(i~hidden~a)(i~default~a~_F))(i~parkingAreas~s~!(i~hidden~a~_F)(i~default~a)(i~street*_side~a~_F))(i~parkingDebug~s~!(i~hidden~a)(i~default~a~_F))(i~parkingStats~s~!(i~hidden~a)(i~stats-admin-level-4~a~_F)(i~default~a~_F)(i~stats-admin-level-10~a~_F)(i~length-admin-level-4~a~_F)(i~length-admin-level-9~a~_F)(i~length-admin-level-10~a~_F))(i~landuse~s~!(i~hidden~a)(i~default~a~_F)))~',
    )

    test('MIGRATION: Update old `config`s: Check if all `nameMigrations` are done', () => {
      const response = middleware(sharedMockMigrationRequest)
      const url = getUrl(response)
      const configParam = url.searchParams.get('config')

      // Check if all `nameMigrations` are done
      expect(configParam?.includes('fromTo')).toBeFalsy()
      expect(configParam?.includes('shops')).toBeFalsy()
      expect(configParam?.includes('roadClassification')).toBeFalsy()
      expect(configParam?.includes('topics')).toBeFalsy()
    })

    test('MIGRATION: Update old `config`s: Check if the migrated config preserved the given active state', () => {
      const responseMigrated = middleware(sharedMockMigrationRequest)
      const urlMigrated = getUrl(responseMigrated)
      const migratedParam = urlMigrated.searchParams.get('config')

      // Also check that a fresh config has different defaults than our migrated version
      const responseDefault = middleware(new NextRequest('http://127.0.0.1:5173/regionen/berlin'))
      const urlDefault = getUrl(responseDefault)
      const defaultParam = urlDefault.searchParams.get('config')

      expect(defaultParam?.includes('(i~poi~s~!(i~hidden~a~_F)(i~default~a)')).toBe(true)
      expect(migratedParam?.includes('(i~poi~s~!(i~hidden~a)(i~default~a~_F)')).toBe(true)

      // Note: Subcategory of type ui:checkbox do not have a "hidden" layer
      expect(defaultParam?.includes('(i~poiPlusBarriers~s~!(i~default~a~_F)')).toBe(true)
      expect(migratedParam?.includes('(i~poiPlusBarriers~s~!(i~default~a)')).toBe(true)
    })

    test('MIGRATION: Make sure params are only present once', () => {
      const responseMigrated = middleware(sharedMockMigrationRequest)
      const urlMigrated = getUrl(responseMigrated)

      expect(urlMigrated.toString().match(/config=/g)?.length).toBe(1)
      expect(urlMigrated.toString().match(/map=/g)?.length).toBe(1)
      expect(urlMigrated.toString().match(/topics=/g)?.length).toBe(undefined)
    })

    test('TEST: Invalid map param is handled properly', () => {
      // see also useMapParam.test.ts
      let response = middleware(
        new NextRequest('http://127.0.0.1:5173/regionen/bibi?map=11/48.9/9.9'),
      )
      let map = getUrl(response).searchParams.get('map')!
      expect(parseMapParam(map)).toStrictEqual({ zoom: 11, lat: 48.9, lng: 9.9 })

      response = middleware(new NextRequest('http://127.0.0.1:5173/regionen/bibi?map=11/48A9/9.9'))
      map = getUrl(response).searchParams.get('map')!
      expect(parseMapParam(map)).toHaveProperty('zoom')
    })

    test('CLEANUP: Remove unused params', () => {
      const mockRequest = new NextRequest(
        'http://127.0.0.1:5173/regionen/berlin?theme=theme&config=config&foo=foo&bar=bar&map=map',
      )
      const response = middleware(mockRequest)
      const url = getUrl(response)

      expect(url.searchParams.get('theme')).toBe(null)
      expect(url.searchParams.get('foo')).toBe(null)
      expect(url.searchParams.get('bar')).toBe(null)
      expect(typeof url.searchParams.get('map')).toBe('string')
      expect(typeof url.searchParams.get('config')).toBe('string')
    })
  })
})
