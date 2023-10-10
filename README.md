<div align="center">
  <!-- <img src="src/images/" height="80" /> -->
  <h1 align="center"><a href="https://radverkehrsatlas.de/">radverkehrsatlas.de</a></h1>
  <h3><strong>(!)</strong> This project ist still in development</h3>
</div>

## About

**Radverkehrsatlas** provides access to **bicycle infrastructure** data from [**OpenStreetMap** (OSM)](https://www.openstreetmap.org) for administrative staff. The OSM data is processed and visualized in multiple map views. The integrated verification process provided a way for administrations to check the given data and provide feedback – internally and to the community. Based on this data, administrations can plan new bike lanes and networks and maintain existing infrastrucutre.

The backend, for processing and storing the geographic data, is located at [atlas-geo](https://github.com/FixMyBerlin/atlas-geo).

## Develop

We use React as a Frontend Framework and [Vite](https://vitejs.dev/) for building and serving. The styling is done via [Tailwind CSS](https://tailwindcss.com/).

For VS Code we [recommended](.vscode/extensions.json) some extensions.

To test the login, you need to setup your own OSM OAuth 2-Application, see [osm-auth](https://github.com/osmlab/osm-auth#registering-an-application) and use [update the credentials](/src/components/Layout/Header/User/User.tsx).

## Update mapbox styles

See [/scripts/MapboxStyles/README.md](./scripts/MapboxStyles/README.md) on how to fetch updated style definitions from Mapbox.

## Getting Started

Install npm packages, then continue.

```sh
# Start the development server
npm start
```

```sh
# For building to `dist/`
npm run build
```

## Contribute

If you find any bugs, feel free to open an issue in this repository.

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for more information.
It contains dependencies which have different Licenses, see [`package.json`](./package.json).

## Thanks

- Thank you [Vite](https://vitejs.dev/) and [Vitest](https://vitest.dev/)
- Thank you [React Location](https://github.com/TanStack/router)
- Thank you [Tailwind CSS](https://tailwindcss.com/), [Tailwind UI](https://tailwindui.com/) and [Headless UI](https://headlessui.com/)
