import client from "~/api/client";
import { useUserStore } from "~/store";
import { ErrorResponse } from "~/types/auth";
import { LeadInsertData, LeadData, LeadUpdateData } from "~/types/lead";

// export const getLeads = async (): Promise<any> => {
//   try {
//     const response = await client.get("/leads");
//     return response.data;
//   } catch (error: any) {
//     if (error.response && error.response.data) {
//       throw { errorMessage: error.response.data.error } as any;
//     } else {
//       throw { errorMessage: "An unexpected error occurred" } as any;
//     }
//   }
// };

export const getAllLeads = async (): Promise<LeadData[]> => {
  try {
    const response = await client.get("/user/lead/get", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
    }
  }
};

export const insertLead = async (data: LeadInsertData): Promise<any> => {
  try {
    const response = await client.post("/user/lead/insert", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
    }
  }
};

export const updateLead = async (data: LeadUpdateData): Promise<any> => {
  try {
    const response = await client.patch("/user/lead/update", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
    }
  }
};
