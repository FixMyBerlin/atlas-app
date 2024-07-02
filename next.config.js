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
      // https://react.dev/learn/react-compiler#usage-with-nextjs
      reactCompiler: true,
      // https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links
      typedRoutes: true,
      instrumentationHook: true,
    },
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
    redirects: async () => [
      // https://stackoverflow.com/a/70184067
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.radverkehrsatlas.de' }],
        destination: 'https://radverkehrsatlas.de/:path*',
        permanent: true,
      },
    ],
  }),
)
