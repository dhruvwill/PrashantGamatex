export type LoginData = {
  username: string;
  password: string;
  company: "PrashantGamatex" | "WestPoint" | "Serber";
};

export type AuthResponse = {
  payload: {
    uid: string;
    username: string;
    name: string;
    company: "PrashantGamatex" | "WestPoint" | "Serber";
  };
  token: string;
};
