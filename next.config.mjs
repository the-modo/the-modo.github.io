/** @type {import('next').NextConfig} */
// User pages (dev-modo.github.io) serve at the domain root, so no basePath.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
export default nextConfig
