const { withBlitz } = require('@blitzjs/next')

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
module.exports = withBlitz({
  experimental: {
    // https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links
    typedRoutes: true,
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
    ],
  },
})
