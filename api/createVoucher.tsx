import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const createVoucher = createApi({
  reducerPath: "createVoucher",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    createVoucher: builder.mutation<any, any>({
      query: ({ ...value }) => ({
        url: "/v1/vouchers",
        method: "POST",
        body: value,
        headers: {
          "X-Loblaw-Tenant-ID": `JOE_FRESH`,
          "x-apikey":
            "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo=",
          "X-Loblaw-Support-Tool-ID": "BO",
          "X-User-Name": value.username,
        },
      }),
    }),
  }),
});
export const { useCreateVoucherMutation } = createVoucher;
