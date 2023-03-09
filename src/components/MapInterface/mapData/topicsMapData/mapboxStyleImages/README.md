# About

**Context:**

Whenever we use **icon images** or **line patterns** in Mapbox Studio, we need to manually add them here as well.

**What to do:**

Each of those `IMAGE_ID` …

- needs to be added to [`./images`](./images/) and
- referenced in [`./mapboxStyleImages.ts`](./mapboxStyleImages.ts).

**Image requirements:**

- They need to be `png` images.
- TODO what about size?, use `pixelRatio=2`

---

**Info: Where to finde the image ids:**

- a style layer of `type=symbol` can have a property `layout.icon-image=IMAGE_ID`.
- a style layer of `type=line` can have a property `paint.line-pattern=IMAGE_ID`.
- also `background-pattern`
- also `fill-pattern`

The relevant file is [mapbox-layer-styles-by-group.json](../mapboxStyles/mapbox-layer-styles-by-group.json)

**Docs**

Maplibre Docs are linked in [`useMissingImage.ts`](../../../../MapInterface/Map/utils/useMissingImage.ts)
