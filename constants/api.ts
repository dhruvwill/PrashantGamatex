export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.EXPO_PUBLIC_API_URL;

// export const API_URL = process.env.EXPO_PUBLIC_API_URL;
// export const API_URL =
//   "https://3943-2409-40c1-10d3-4ff-489f-ede6-12bc-e29f.ngrok-free.app";

export const API_URL =
  "https://205c-2409-40c1-103a-d888-3185-f38b-82b5-9236.ngrok-free.app";
// export const API_URL = "https://pgplcrm.prasadsos.co:8091";

console.log("API_URL", API_URL);
