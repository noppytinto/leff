/** @type {import('next').NextConfig} */

// const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const nextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
  },
  // define proxy for api
  // async rewrites() {
  //   console.log('fffffffffffffffffffffffffffffffffffffffffff rewrites:');
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${BASE_URL}/api/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
