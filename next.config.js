const imageHosts = [
  "flagcdn.com",
  "cbu01.alicdn.com",
  "deshmart-office-upload-live.s3.ap-south-1.amazonaws.com",
];

const normalizeEndpoint = (value) => value?.replace(/\/+$/, "");

module.exports = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  async rewrites() {
    const apiEndpoint = normalizeEndpoint(process.env.DESHMART_API_ENDPOINT);
    if (!apiEndpoint) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${apiEndpoint}/:path*`,
      },
    ];
  },
};
