const imageHosts = [
  "flagcdn.com",
  "cbu01.alicdn.com",
  "deshmart-office-upload-live.s3.ap-south-1.amazonaws.com",
];

module.exports = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};
