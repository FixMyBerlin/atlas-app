<div align="center">
  <!-- <img src="src/images/" height="80" /> -->
  <h1 align="center"><a href="https://radverkehrsatlas.de/">radverkehrsatlas.de</a></h1>
  <h3><strong>(!)</strong> This project ist still in development</h3>
</div>

## About

**Radverkehrsatlas** provides access to **bicycle infrastructure** data from [**OpenStreetMap** (OSM)](https://www.openstreetmap.org) for administrative staff. The OSM data is processed and visualized in multiple map views. The integrated verification process provided a way for administrations to check the given data and provide feedback – internally and to the community. Based on this data, administrations can plan new bike lanes and networks and maintain existing infrastrucutre.

The backend, for processing and storing the geographic data, is located at [atlas-geo](https://github.com/FixMyBerlin/atlas-geo).

## Develop

- Framework: [NextJS](https://nextjs.org/) with [BlitzJS](https://blitzjs.com/)
- ORM: [Prisma](https://blitzjs.com/docs/cli-prisma)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

For VS Code we [recommended](.vscode/extensions.json) some extensions.

To test the login, you need to setup your own OSM OAuth 2-Application, see [osm-auth](https://github.com/osmlab/osm-auth#registering-an-application) and use [update the credentials](/.env.example).

### Testing the production bundle

1. use `docker compose up` to start the developlemnt server and make sure everthing works as expected.
2. use `docker compose run app start` to serve and build the production bundle.
3. to run the npm scripts defined in the [`package.json`](./package.json) use `docker compose run app <script_name>`.

### NextJS tips

- Favicons:
  `icon.svg` https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
  Generator for `favicon.ico` https://realfavicongenerator.net/

## Helper scripts

All helper scripts run with [bun](https://bun.sh/).

### Update mapbox styles

See [/scripts/MapboxStyles/README.md](./scripts/MapboxStyles/README.md) on how to fetch updated style definitions from Mapbox.

### Update regional masks

See [/scripts/RegionalMasks/README.md](./scripts/RegionalMasks/README.md) on how to fetch updated the regional mask data.

### Update datasets

See [/datasets/README.md](./datasets/README.md) on how to process and update external datasets.

## Contribute

If you find any bugs, feel free to open an issue in this repository.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for more information.
It contains dependencies which have different Licenses, see [`package.json`](./package.json).

## Thanks

For the current version:

- Thank you [BlitzJS](https://blitzjs.com/) and [NextJS](https://nextjs.org/)
- Thank you [next-usequerystate](https://github.com/47ng/next-usequerystate/)
- Thank you [Tailwind CSS](https://tailwindcss.com/), [Tailwind UI](https://tailwindui.com/) and [Headless UI](https://headlessui.com/)

For the alpha version:

- Thank you [Vite](https://vitejs.dev/) and [Vitest](https://vitest.dev/)
- Thank you [React Location](https://github.com/TanStack/router)
