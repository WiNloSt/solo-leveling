/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: '/',
        destination: '/chapters',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coffeemanga.io',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cm.blazefast.co',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hxmanga.com',
        port: '',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
