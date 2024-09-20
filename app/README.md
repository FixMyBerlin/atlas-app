# `app` README

## Monorepo

Please read the [README](../README.md) first.

## About

The frontend visualizes our processed data it also provides options to annotate and export the data.

## Development

### Initial setup

1. Create a `/.env` file in the root folder based on [`/.env.example`](/.env.example).
1. To test the login, you need to setup your own OSM OAuth 2-Application, see [osm-auth](https://github.com/osmlab/osm-auth#registering-an-application) and [update the credentials](/.env.example).

### Start

Run `nvm use` to user the recommended NodeJS version.

Run `npm run dev` wich will start docker and `../processing` automatically if needed.

### Our Tooling

- Framework: [NextJS](https://nextjs.org/) with [BlitzJS](https://blitzjs.com/)
- URL State Management: [nuqs](https://github.com/47ng/nuqs)
- ORM: [Prisma](https://blitzjs.com/docs/cli-prisma)
- Styling: [Tailwind CSS](https://tailwindcss.com/), [Tailwind UI](https://tailwindui.com/) and [Headless UI](https://headlessui.com/)

### (Tip) Testing the production bundle

In the [`app/`](./app/) directory do the following:

1. Make sure `npm run dev` works as expected. This will make sure all packages are patched.
2. Create a `.env.production.local` with settings like
   ```
   NEXT_PUBLIC_APP_ORIGIN=http://127.0.0.1:3000
   NEXT_PUBLIC_APP_ENV='staging' # 'staging', 'production'
   ```
3. Run `npm run build` and `npm run start` to test the production bundle. There is also a dockerized version of our frontend which one can run with `docker compose --profile frontend up`.

### (Tip) NextJS

- Favicons:
  `icon.svg` https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
  Generator for `favicon.ico` https://realfavicongenerator.net/

## Helper scripts

All [helper scripts](./scripts) run with [bun](https://bun.sh/).

- **Update mapbox styles** – See [/scripts/MapboxStyles/README.md](./scripts/MapboxStyles/README.md) on how to fetch updated style definitions from Mapbox.
- **Update regional masks** – See [/scripts/RegionalMasks/README.md](./scripts/RegionalMasks/README.md) on how to fetch updated the regional mask data.
- **Update datasets** – See [/datasets/README.md](./datasets/README.md) on how to process and update external datasets.
