import client from "~/api/client";
import { useUserStore } from "~/store";
import { ErrorResponse } from "~/types/auth";
// // import { Lead, LeadResponse, ErrorResponse } from "~/types/lead";

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

export const insertLead = async (data: LeadInsertData): Promise<any> => {
  try {
    const response = await client.post("/leads", data, {
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
