import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const editVoucher = createApi({
    reducerPath: "editVoucher",
    baseQuery: CustomQuery(),
    endpoints: (builder) => ({
        editVoucher: builder.mutation<any, any>({
            query: ({ ...value }) => ({
                url: `v1/vouchers/${value.voucherId}`,
                method: "PATCH",
                body: value,
                headers: {
                    "X-Loblaw-Tenant-ID": "JOE_FRESH",
                    "X-User-Name": value.username
                },
            }),
        }),
    }),
});
export const { useEditVoucherMutation } = editVoucher;

