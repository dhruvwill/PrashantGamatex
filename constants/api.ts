export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = "http://192.168.88.68:3000";
// export const API_URL = "https://pgplcrm.prasadsos.co:8091";
export const API_URL =
  "https://1d65-2409-40c1-24-18a6-e56d-7922-71f-82d9.ngrok-free.app";

console.log("API_URL", API_URL);
