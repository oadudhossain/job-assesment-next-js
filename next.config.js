/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "propsoft-demo.nyc3.digitaloceanspaces.com",
        port: "",
        pathname: "/account123/**",
      },
    ],
  },
};
