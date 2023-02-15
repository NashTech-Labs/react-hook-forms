import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const deleteDeal = createApi({
  reducerPath: "deleteDeal",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    deleteDeal: builder.mutation<any, Number[]>({
      query: (deal_Ids) => ({
        url: `v1/deal/deals`,
        method: "DELETE",
        body: {
          "ids": deal_Ids
        },
        headers: {
          "X-Loblaw-Tenant-ID": `JOE_FRESH`
        },
      }),
    }),
  }),
});
export const { useDeleteDealMutation } = deleteDeal;
