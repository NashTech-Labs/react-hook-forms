import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const editDeals = createApi({
    reducerPath: "editDeal",
    baseQuery: CustomQuery(),
    endpoints: (builder) => ({
        editDeals: builder.mutation<any, any>({
            query: ({ ...value }) => ({
                url: `v1/deal/${value.dealId}`,
                method: "PATCH",
                body: value,
                headers: {
                    "X-Loblaw-Tenant-ID": `JOE_FRESH`,
                    "x-apikey": "6bbd4e6c-ae21-40b3-add3-91240bb07db0"
                },
            }),
        }),
    }),
});
export const { useEditDealsMutation } = editDeals;

