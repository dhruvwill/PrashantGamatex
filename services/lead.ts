import client from "~/api/client";
import { useUserStore } from "~/store";
import { ErrorResponse } from "~/types/query";
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
      // throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
      throw { errorMessage: error.message } as ErrorResponse;
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
      // throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
      throw { errorMessage: error.message } as ErrorResponse;
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
      // throw { errorMessage: "An unexpected error occurred" } as ErrorResponse;
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};

export const getDocumentNo = async (
  token: string | undefined,
  categoryName: string
): Promise<any> => {
  try {
    const response = await client.get("/const/get/documentno/lead", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        CategoryName: categoryName,
      },
    });
    return response.data[0];
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};
