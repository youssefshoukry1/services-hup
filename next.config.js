const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" }],
  },
};

export default nextConfig;
