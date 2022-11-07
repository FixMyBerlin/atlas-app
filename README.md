<div align="center">
  <!-- <img src="src/images/" height="80" /> -->
  <h1 align="center"><a href="https://radverkehtsatlas.de">Radverkehrsatlas.de</a></h1>
  <h3><strong>Attention!</strong> This is still in development phase</h3>
</div>

## About
**Radverkehrsatlas** displays the existent road and **bicycle infrastructure** in various categories as a map application. It enables you to integrate a verification process of [**OpenStreetMap**](https://www.openstreetmap.org) data and manage your relevant bicycle infrastructure. **Verification** is a way to ensure data quality in your region, in OpenStreetMap. Makes your planning of new and upgrading infrastructure easier. Login with your OSM Account to start verifying your infrastructure and export your desired data.

The backend, for processing and storing the geographic data, is located in the [tarmac-geo](https://github.com/FixMyBerlin/tarmac-geo).

## Develop

We use React as a Frontend Framework and [Vite](https://vitejs.dev/) for building and serving. The styling is done via [Tailwind CSS](https://tailwindcss.com/) and [UI](https://tailwindui.com/).

For VS Code we [recommended](.vscode/extensions.json) some extensions.

To get started, you need to setup your own OSM OAuth-Application, see [osm-auth](https://github.com/osmlab/osm-auth#registering-an-application) and use the client id and secret.

*TODO* Where to configure osm-auth secrets

## Getting Started

Install npm packages, then continue.

```sh
# Start the development server
npm start
# For building
npm run build
```
*You'll find the build output in `dist/`*

## Contribute

If you find any bugs, feel free to open an issue.
## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for more information.
It contains dependencies which have different Licenses, see [`package.json`](./package.json).

## Thanks

- Thank you [Vite](https://vitejs.dev/) and [Vitest](https://vitest.dev/)
- Thank you [React Location](https://github.com/TanStack/router)
- Thank you [Tailwind CSS](https://tailwindcss.com/), [Tailwind UI](https://tailwindui.com/) and [Headless UI](https://headlessui.com//).
