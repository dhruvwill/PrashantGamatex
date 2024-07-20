export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = "https://013b-152-59-4-202.ngrok-free.app";
export const API_URL = "https://pgplcrm.prasadsos.co:8091";

console.log("API_URL", API_URL);
