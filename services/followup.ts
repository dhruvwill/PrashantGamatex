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

export const getDocumentNo = async (
  token: string | undefined,
  categoryName: string
): Promise<any> => {
  try {
    const response = await client.get("/const/get/documentno/followup", {
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

export const getCategories = async (token: string | undefined) => {
  try {
    const response = await client.get("/const/get/category/followup", {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const getFollowupList = async (
  SalesInquiryId: number,
  SalesQuotationId: number,
  type: string
) => {
  try {
    const response = await client.get("/user/followup/get", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + useUserStore.getState().user?.token,
      },
      params: {
        SalesInquiryId,
        SalesQuotationId,
        type,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.log("error", error.response.data.error);
      throw { errorMessage: error.response.data.error } as ErrorResponse;
    } else {
      console.log("error", error.message);
      throw { errorMessage: error.message } as ErrorResponse;
    }
  }
};
