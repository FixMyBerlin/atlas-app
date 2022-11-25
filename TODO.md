# TODOs

## After the cofig is updated with themes, rename the last "\*DataConfig" files and folders by removing the Config-part

I did not want to do this as part of 517eb9f because it would merge unrelated changes.

## Ask for clean way to solve 2a95e8c

How to lookup the path based on a :param path.

## Link

Write a ticket to get a pattern like TailwindUI has whree on can say
`<Link className={(active) => classeNames('foo', active ? 'foo', 'baz')}>`

## Check radiobutton filter in Mapillary

## Use a map for mapDataConfig

- We can use `.get(ID)` instead of `.find` or `.findIndex`
- Its recommended in https://immerjs.github.io/immer/update-patterns at the end of the page

## Switch from Zustand zu Jotai

It feels like Jotais model does fit more in our application.

https://jotai.org/docs/guides/typescript

## `@tanstack/react-location-devtools`: Cleanup package.json overwrite

This needs a kind of ugly override in package.json, see https://github.com/TanStack/router/issues/257#issuecomment-1154737874
Once that issue is resolved, we should cleanup the overwrite.

# Plugins / Feature that we had with Gatsby (or Next) but dont have now…

- Matomo
  Siehe https://www.npmjs.com/package/@socialgouv/matomo-next

- Auth mit Strapi
  Siehe https://medium.com/@tom555my/strapi-next-js-email-password-authentication-a8207f72b446

- Sitemap Plugin

  - exclude '/kontakt/', '/datenschutz/'
  - Plugin https://www.npmjs.com/package/next-sitemap
  - Oder manuell schreiben…
    - https://blog.logrocket.com/build-sitemap-generator-nextjs/
    - https://enlear.academy/how-to-create-sitemaps-with-nextjs-668da9601a03

- Manifest Plugin

  - https://developer.mozilla.org/en-US/docs/Web/Manifest/display#values

- Sentry

  - https://github.com/vercel/next.js/tree/canary/examples/with-sentry

- mdx
  - `npm install @next/mdx @mdx-js/loader`
  - https://nextjs.org/docs/advanced-features/using-mdx

# Map

// TODO: Liefert Zeichen-Tools für die Karte
// https://github.com/mapbox/mapbox-gl-draw
// useControl(() => new MapboxDraw(), {
// position: 'bottom-left',
// })

# LATER

- i18n https://nextjs.org/docs/advanced-features/i18n-routing

# Move this config to a spearate external data file at some point – for reagion berlin

// Docs https://docs.mapbox.com/api/maps/static-tiles/
// Edit Style https://studio.mapbox.com/styles/hejco/ckz8bsqbq000t15nz6ok45bid/edit/#15.61/52.495655/13.417375
// TODO Lizenz / Attribution
// About Quota: Make sure we only pull data where avaliable and only for zoom level that are usefull.
// Quota at: https://account.mapbox.com/
// Docs: https://docs.mapbox.com/api/maps/static-tiles/#manage-static-tiles-api-costs
// xhainGutachten_tiles: {
// name: 'Parkraumgutachten Xhain',
// type: 'raster',
// tiles: 'https://api.mapbox.com/styles/v1/hejco/ckz8bsqbq000t15nz6ok45bid/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q',
// ,
// tileSize: 512,
// minzoom: 18, // Quota
// maxzoom: 21,
// // bounds: L.latLngBounds(L.latLng(52.5310256, 13.4914434), L.latLng(52.4827923, 13.3682291)), // Quota (outside no data is loaded for this layer)
// attribution:
// 'Daten der Parkraumgutachten der Bezirksverwaltung. OpenData. Lizenz TODO.',
// },
