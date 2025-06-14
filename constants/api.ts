export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = "http://192.168.50.199:3000";
export const API_URL = "https://pgplcrm.prasadsos.co:8091";
// export const API_URL =
//   "https://d4df-2409-40c1-33-d30d-cd78-af84-5cb-d6df.ngrok-free.app";

console.log("API_URL", API_URL);
