export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL =
  "https://f121-2409-40c1-4028-d9ed-10b4-cea0-6b69-3ad3.ngrok-free.app";

// export const API_URL = "http://43.252.197.78:8091";

console.log("API_URL", API_URL);
