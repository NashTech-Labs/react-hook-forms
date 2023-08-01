import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const deleteVoucher = createApi({
  reducerPath: "deleteVoucher",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    deleteVoucher: builder.mutation<any,any>({
      query: (params) => ({
        url: `v1/vouchers`,
        method: "DELETE",
        body: {
          "ids": params.voucher_Ids
        },
        headers: {
          "X-Loblaw-Tenant-ID": `JOE_FRESH`,
          "X-User-Name" : params.user.name
        },
      }),
    }),
  }),
});
export const { useDeleteVoucherMutation } = deleteVoucher;
