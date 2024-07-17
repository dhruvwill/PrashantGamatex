export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
// export const API_URL =
//   "https://3943-2409-40c1-10d3-4ff-489f-ede6-12bc-e29f.ngrok-free.app";

export const API_URL =
  "https://0464-2409-40c1-50-1dce-7d1c-dd11-3963-78df.ngrok-free.app";
// export const API_URL = "https://pgplcrm.prasadsos.co:8091";

console.log("API_URL", API_URL);
