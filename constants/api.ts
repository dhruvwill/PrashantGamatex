export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = "http://192.168.50.199:3000";
// export const API_URL = "https://pgplcrm.prasadsos.co:8091";
export const API_URL =
  "https://22c0-2409-40c1-0-fdb8-3407-8418-de46-fd58.ngrok-free.app";

console.log("API_URL", API_URL);
