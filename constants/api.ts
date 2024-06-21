export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_URL =
  "https://c997-2409-40c1-51-28b8-c4a0-65eb-f7e-8a9c.ngrok-free.app";

// export const API_URL="http://43.252.197.78:8091/auth/login"

console.log("API_URL", API_URL);
