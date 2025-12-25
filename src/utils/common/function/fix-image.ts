export const fixImageUrl = (url: any) => {
  if (!url) return "";
  return url.replace("img/ibank/", "");
};
