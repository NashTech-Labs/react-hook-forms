import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const createDeals = createApi({
    reducerPath: "createDeals",
    baseQuery: CustomQuery(),
    endpoints: (builder) => ({
        createDeals: builder.mutation<any, any>({
            query: ({ ...value }) => ({
                url: "/v1/deal/createDeal",
                method: "POST",
                body: value,
                headers: {
                    "X-Loblaw-Tenant-ID": `JOE_FRESH`,
                    "x-apikey": "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo="
                },
            }),
        }),
    }),
});
export const { useCreateDealsMutation } = createDeals;

