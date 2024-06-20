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
}

export default nextConfig
