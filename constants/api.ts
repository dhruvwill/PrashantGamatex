export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
// export const API_URL =
//   "https://3943-2409-40c1-10d3-4ff-489f-ede6-12bc-e29f.ngrok-free.app";

export const API_URL = "https://8e7c-152-59-3-211.ngrok-free.app";
// export const API_URL = "https://pgplcrm.prasadsos.co:8091";

console.log("API_URL", API_URL);
