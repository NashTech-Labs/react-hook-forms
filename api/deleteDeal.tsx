import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

interface deleteDealList {
  deal_Ids: number[]
  user: any
}

export const deleteDeal = createApi({
  reducerPath: "deleteDeal",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    deleteDeal: builder.mutation<any, deleteDealList>({
      query: (params) => ({
        url: `v1/deals`,
        method: "DELETE",
        body: {
          "ids": params.deal_Ids
        },
        headers: {
          "X-Loblaw-Tenant-ID": `JOE_FRESH`,
          'X-User-Name': params.user.name
        },
      }),
    }),
  }),
});
export const { useDeleteDealMutation } = deleteDeal;
