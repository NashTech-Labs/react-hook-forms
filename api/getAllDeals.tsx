import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface AllDealsList {
  mediaUrl: string;
  dealTitle: string;
  validFrom: string;
  validTo: string;
  type: string;
  status: string;
  dealValue: [
    {
      rewardType: string,
      rewardValue: string
    }
  ],
  identifier: string;
}

export interface newAllDealsList {
  deals: AllDealsList[];
  paginationInfo: any;
}


export const viewAllDeals = createApi({
  reducerPath: "viewAllDeals",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getAllList: builder.query<newAllDealsList, void>({
      query: () => ({
        url: `/v1/deals`,
        method: "GET",
        headers: {
          "X-Loblaw-Tenant-ID": "JOE_FRESH",
          "x-apikey": "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo="
        },
      }),
    }),
  }),
});
export const { useGetAllListQuery } = viewAllDeals;
