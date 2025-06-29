export type LoginData = {
  username: string;
  password: string;
  company: "PrashantGamatex" | "WestPoint" | "Ferber";
  DeviceName: string;
};

export type AuthResponse = {
  payload: {
    uid: string;
    username: string;
    name: string;
    company: "PrashantGamatex" | "WestPoint" | "Ferber";
  };
  token: string;
};

export type ChangePasswordData = { 
  currentPassword: string;
  confirmCurrentPassword: string;
  newPassword: string;
};
