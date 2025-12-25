import secureLocalStorage from "react-secure-storage";

export const getSafeJSON = (key: string, fallback: any) => {
  const value = secureLocalStorage.getItem(key);
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};
