export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL =
  "https://eb80-2409-40c1-103f-e99c-9018-84a0-e4e0-a40f.ngrok-free.app";

// export const API_URL = "http://43.252.197.78:8091";

console.log("API_URL", API_URL);
