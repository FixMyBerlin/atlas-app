# Code

- 'mapbox.TYPE' ersetzten durch 'maplibre.TYPE'? Und die Types aus der package-json (oder wo kommen sie her) löschen

# Hierarchy TODO

- map

  - background: maptiler, raster
  - provider: lars(parkraum), tarmac/our stuff
    desc: the doamin of the data (alt name: 'domain')

    - source: parking, tarmac-pois, tarmac-highways, unfallatlas, …
      desc: the vector tile URL of the raw data; name is fixed by library

      - topic: tarmac-poi--barriers, tarmac-poi--shops
        desc: thematic "filter" of the (raw vector tile) data

        - style: default, missing, debug, …
          desc: different views of the same data; can contain static filter ("only lines with todos")

          - layer: line, label, area, heatmap
            desc: name fixed by library

          - filter: by year
            desc: interactive filter that can be activated to change the data of a style

  - data

# Next.js

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
