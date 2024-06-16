export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL =
  "https://ad24-2409-40c1-1022-9d84-f1f2-6468-8962-ad54.ngrok-free.app";

console.log("API_URL", API_URL);
