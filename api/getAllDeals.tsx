import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface AllDealsList {
  mediaUrl: string;
  dealTitle: string;
  valid_from: string;
  valid_to: string;
  type: string;
  status: string;
  dealValue: string;
  identifier: string;
}

export const viewAllDeals = createApi({
  reducerPath: "viewAllDeals",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getAllList: builder.query<AllDealsList[], void>({
      query: () => ({
        url: `/v1/deal/viewAllDeals`,
        method: "GET",
        headers: {
          "X-Loblaw-Tenant-ID": "JOE_FRESH",
          "X-Loblaw-Support-Tool-ID": "BO",
        },
      }),
    }),
  }),
});
export const { useGetAllListQuery } = viewAllDeals;
