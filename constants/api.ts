export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = "http://192.168.50.199:3000";
export const API_URL = "https://pgplcrm.prasadsos.co:8091";
// export const API_URL =
//   "https://9c08-2409-40c1-3b-3ab1-90ac-83d2-b3d8-181c.ngrok-free.app";

console.log("API_URL", API_URL);
