const baseDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
  ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.includes(",")
    ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",")
    : [process.env.NEXT_PUBLIC_IMAGE_DOMAINS]
  : [];

module.exports = {
  reactStrictMode: false,
  images: {
    domains: [
      ...baseDomains,
      "flagcdn.com",
      "cbu01.alicdn.com",
      "deshmart-office-upload-live.s3.ap-south-1.amazonaws.com",
    ],
  },
};
