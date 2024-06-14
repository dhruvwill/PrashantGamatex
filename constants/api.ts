export const inProduction = process.env.NODE_ENV === "production";

// export const API_URL = inProduction
//   ? "https://prashantgroup.com"
//   : process.env.API_URL;
export const API_URL =
  "https://e2c3-2409-40c1-2-3ddd-bdab-735c-af4b-4b79.ngrok-free.app";
console.log("apiDomain:", API_URL);
console.log("apiDomain:", process.env.API_URL);
console.log("Environmetn:", inProduction ? "Production" : "Development");
