import client from "~/api/client";
import { useUserStore } from "~/store";
import { SalesFollowupInsert, SalesInquiryFollowup } from "~/types/followup";
import { ErrorResponse } from "~/types/query";

export const getInquiryFollowups = async (): Promise<
  SalesInquiryFollowup[]
> => {
  try {
    const response = await client.get("/user/followup/inquiry/get", {
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
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};

export const getQuotationFollowups = async (): Promise<
  SalesInquiryFollowup[]
> => {
  try {
    const response = await client.get("/user/followup/quotation/get", {
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
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};

export const insertInquiryFollowup = async (data: SalesFollowupInsert) => {
  try {
    await client.post("/user/followup/inquiry/insert", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};

export const insertQuotationFollowup = async (data: SalesFollowupInsert) => {
  try {
    await client.post("/user/followup/quotation/insert", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
    });
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};
