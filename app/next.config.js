const { withBlitz } = require('@blitzjs/next')
const { withNextAuthAdapter } = require('@blitzjs/auth/next-auth')

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
module.exports = withBlitz(
  withNextAuthAdapter({
    // StrictMode: Should be default, but just in case…
    // Docs: https://nextjs.org/docs/app/api-reference/next-config-js/reactStrictMode
    // See also: https://github.com/facebook/react/issues/29130
    reactStrictMode: true,
    experimental: {
      // https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links
      typedRoutes: true,
      instrumentationHook: true,
    },
    swcMinify: true, // See https://nextjs.org/docs/messages/swc-minify-enabled
    productionBrowserSourceMaps: true, // build source maps in production – https://nextjs.org/docs/advanced-features/source-maps
    images: {
      // Allowlist of external image sources for next/image <Image />
      // Docs https://nextjs.org/docs/messages/next-image-unconfigured-host
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.gravatar.com',
          port: '',
          pathname: '/avatar/**',
        },
        {
          protocol: 'https',
          hostname: 'www.openstreetmap.org',
          port: '',
          pathname: '/**',
        },
      ],
    },
    // Source Maps on the Server
    // Via https://www.highlight.io/blog/lw5-next-js-server-sourcemaps
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.devtool = 'source-map'
      }
      return config
    },
    redirects: async () => [
      // https://stackoverflow.com/a/70184067
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.tilda-geo.de' }],
        destination: 'https://tilda-geo.de/:path*',
        permanent: true,
      },
    ],
  }),
)
