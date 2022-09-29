# Code

1. Re add tarmac data
1. Fix linter, ts-check
1. Fix filter (default on)
1. Rework logic: Ich habe die mapDatConfig.const, aber diese verwende ich eigentlich nie (direkt). Stattdessen sollte ich eine dynamisch generierte und mit useMemo persistierte version, die optmiert ist um leichter gefilter zu werden. Darin hat dann jeder layer die IDs des parentLayers, also 'topicId', 'styleId' und immer auch einen 'key' der der volle Key ist.

1. interactive layer ids dynamisch setzen
   das müsste den double filter fehlerbeheben, der kommt, wenn man in http://127.0.0.1:3000/?bg=default&topics=parking&styles=%23_parking-presence&filters=accidents-default-years-2019_accidents-default-years-2018 etwas anklickt, weil der presence layer über (unter?) dem default liegt und beide gequeried werden

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
