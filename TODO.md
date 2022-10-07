# TODOs

## Check radiobutton filter in Mapillary

## Re-add Calculator

- And change to on-dblclick

## Re-add Inspector

- And change to onclick

## Die 'config' aktualisiert sich nicht

Wenn ich die Config ändere, wird die App im UI trotzdem auf Basis der URL geladen.
Ich muss also die Config beim ersten Laden prüfen und alten löschen, neues einfügen.

Beispiel: Nur 1 Filter für Unfälle http://localhost:5173/regionen/zes?lat=52.4735&lng=13.4282&zoom=16.8&theme=surface&bg=default&config=JTdDJUMyJUE2JUMyJUE4YWN0aXZlJUMyJUE4JUMyJUE4aWQlQzIlQTglQzIlQThzdHlsZXMlQzIlQTglRTIlODAlQTElQzIlQkIlQzIlQThib3VuZGFyaWVzJUMyJUE4JTdDJTdCJUMzJTlGMSVDMiVBOGRlZmF1bHQlQzIlQTglQzMlOUYwJUMyJUJCJTdEJUMzJUI3JUMyJUFCJUMyJUE4cGFya2luZyVDMiVBOCU3QyVDMiVBNiVDMyU5RjAlQzMlOUYxJUUyJTgwJUExJUMyJUJCJUMzJTlGNCVDMiVBQiVDMiVBOHByZXNlbmNlJUMyJUE4JUMyJUFCJUMyJUE4ZGVidWdMZW5ndGhQZXJDYXBhY2l0eSVDMiVBOCVFMiU4MCU5NCVDMyVCNyVDMiVCQiVDMiVBOGFjY2lkZW50cyVDMiVBOCU3QyU3QiVDMyU5RjElQzMlOUY0JUMzJTlGMCVDMiVCQiVDMiVBOGZpbHRlcnMlQzIlQTglN0MlN0IlQzMlOUYxJUMyJUE4eWVhcnMlQzIlQTglQzIlQThvcHRpb25zJUMyJUE4JTdDJUMyJUE2JUMzJTlGMCVDMyU5RjElRTIlODAlQTElQzIlQUIlQzIlQTgyMDE3JUMyJUE4JUMyJUJCJUMyJUE4MjAxOCVDMiVBOCVDMiVBQiVDMiVBODIwMTklQzIlQTglRTIlODAlOTQlQzMlQjclN0QlQzMlQjclN0QlQzMlQjclQzIlQUIlQzIlQThzdXJmYWNlJUMyJUE4JTdDJUMyJUE2JUMzJTlGMCVDMyU5RjElRTIlODAlQTElQzIlQkIlQzMlOUY0JUMyJUFCJUMyJUE4YmFkJUMyJUE4JUMyJUFCJUMyJUE4ZGVidWctc21vb3RobmVzcyVDMiVBOCVFMiU4MCU5NCVDMyVCNyVDMiVBQiVDMiVBOGJpa2VsYW5lcyVDMiVBOCU3QyVDMiVBNiVDMyU5RjAlQzMlOUYxJUUyJTgwJUExJUMyJUJCJUMzJTlGNCVDMiVBQiVDMiVBOGRldGFpbGVkJUMyJUE4JUUyJTgwJTk0JUMzJUI3JUMyJUFCJUMyJUE4aGlnaHdheUNsYXNzaWZpY2F0aW9uJUMyJUE4JTdDJUMyJUE2JUMzJTlGMCVDMyU5RjElRTIlODAlQTElQzIlQUIlQzIlQTh6ZXMlQzIlQTglQzIlQUIlQzIlQThvc20lQzIlQTglRTIlODAlOTQlQzMlQjclQzIlQUIlQzIlQThtYXBpbGxhcnlDb3ZlcmFnZSVDMiVBOCU3QyU3QiVDMyU5RjElQzMlOUY0JUMzJTlGMCVDMiVCQiVDMyU5RjklN0MlN0IlQzMlOUYxJUMyJUE4cGFub3JhbWElQzIlQTglQzMlOUZCJTdDJUMyJUE2JUMzJTlGMSVFMiU4MCVBMSVDMiVBOHRydWUlQzIlQTglQzIlQThmYWxzZSVDMiVBOCVFMiU4MCU5NCU3QiVDMyU5RjAlQzIlQkIlQzMlOUYxJUMyJUE4bmlsJUMyJUE4JTdEJUMzJUI3JTdEJUMzJUI3JTdEJUMzJUI3JUUyJTgwJTk0JUMzJUI3

## Bei Relaod der URL wird Position+Zoom nicht übernommen

Bspw. http://localhost:5173/regionen/zes?lat=52.3767&lng=13.6176&zoom=14.2&theme=surface&bg=default&config=JTdDJUMyJUE2JUMyJUE4YWN0aXZlJUMyJUE4JUMyJUE4aWQlQzIlQTglQzIlQThzdHlsZXMlQzIlQTglRTIlODAlQTElQzIlQUIlQzIlQThib3VuZGFyaWVzJUMyJUE4JTdDJTdCJUMzJTlGMSVDMiVBOGRlZmF1bHQlQzIlQTglQzMlOUYwJUMyJUJCJTdEJUMzJUI3JUMyJUJCJUMyJUE4cGFya2luZyVDMiVBOCU3QyVDMiVBNiVDMyU5RjAlQzMlOUYxJUUyJTgwJUExJUMyJUJCJUMzJTlGNCVDMiVBQiVDMiVBOHByZXNlbmNlJUMyJUE4JUMyJUFCJUMyJUE4ZGVidWdMZW5ndGhQZXJDYXBhY2l0eSVDMiVBOCVFMiU4MCU5NCVDMyVCNyVDMiVCQiVDMiVBOGFjY2lkZW50cyVDMiVBOCU3QyU3QiVDMyU5RjElQzMlOUY0JUMzJTlGMCVDMiVCQiVDMiVBOGZpbHRlcnMlQzIlQTglN0MlN0IlQzMlOUYxJUMyJUE4eWVhcnMlQzIlQTglQzIlQThvcHRpb25zJUMyJUE4JTdDJUMyJUE2JUMzJTlGMCVDMyU5RjElRTIlODAlQTElQzIlQkIlQzIlQTgyMDE3JUMyJUE4JUMyJUFCJUMyJUE4MjAxOCVDMiVBOCVDMiVBQiVDMiVBODIwMTklQzIlQTglRTIlODAlOTQlQzMlQjclN0QlQzMlQjclN0QlQzMlQjclQzIlQUIlQzIlQThzdXJmYWNlJUMyJUE4JTdDJUMyJUE2JUMzJTlGMCVDMyU5RjElRTIlODAlQTElQzIlQkIlQzMlOUY0JUMyJUFCJUMyJUE4YmFkJUMyJUE4JUMyJUFCJUMyJUE4ZGVidWctc21vb3RobmVzcyVDMiVBOCVFMiU4MCU5NCVDMyVCNyVDMiVBQiVDMiVBOGJpa2VsYW5lcyVDMiVBOCU3QyVDMiVBNiVDMyU5RjAlQzMlOUYxJUUyJTgwJUExJUMyJUJCJUMzJTlGNCVDMiVBQiVDMiVBOGRldGFpbGVkJUMyJUE4JUUyJTgwJTk0JUMzJUI3JUMyJUFCJUMyJUE4aGlnaHdheUNsYXNzaWZpY2F0aW9uJUMyJUE4JTdDJUMyJUE2JUMzJTlGMCVDMyU5RjElRTIlODAlQTElQzIlQUIlQzIlQTh6ZXMlQzIlQTglQzIlQUIlQzIlQThvc20lQzIlQTglRTIlODAlOTQlQzMlQjclQzIlQUIlQzIlQThtYXBpbGxhcnlDb3ZlcmFnZSVDMiVBOCU3QyU3QiVDMyU5RjElQzMlOUY0JUMzJTlGMCVDMiVCQiVDMyU5RjklN0MlN0IlQzMlOUYxJUMyJUE4cGFub3JhbWElQzIlQTglQzMlOUZCJTdDJUMyJUE2JUMzJTlGMSVFMiU4MCVBMSVDMiVBOHRydWUlQzIlQTglQzIlQThmYWxzZSVDMiVBOCVFMiU4MCU5NCU3QiVDMyU5RjElQzIlQThuaWwlQzIlQTglQzMlOUYwJUMyJUJCJTdEJUMzJUI3JTdEJUMzJUI3JTdEJUMzJUI3JUUyJTgwJTk0JUMzJUI3

## Use a map for mapDataConfig

- We can use `.get(ID)` instead of `.find` or `.findIndex`
- Its recommended in https://immerjs.github.io/immer/update-patterns at the end of the page

## Switch from Zustand zu Jotai

It feels like Jotais model does fit more in our application.

https://jotai.org/docs/guides/typescript

## Test

Setup https://vitest.dev/api/ intead of Jest

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
