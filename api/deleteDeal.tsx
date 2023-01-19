import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";


export const deleteDeal = createApi({
  reducerPath: "deleteDeal",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    deleteDeal: builder.mutation<any,string>({
      query: (dealId) => ({
        url: `v1/deal/${dealId}/deleteDeals`,
        method: "DELETE",
        headers: {
            "X-Loblaw-Tenant-ID": `JOE_FRESH`,
            "X-Loblaw-Support-Tool-ID" : "BO"
        },
      }),
    }),
  }),
});
export const { useDeleteDealMutation } = deleteDeal;

