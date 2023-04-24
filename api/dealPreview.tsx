import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface dealPreview {
    generalDealInfo: any;
    applicableProduct: any;
    exclusion: any;
    dealValue: any;
}

export const dealPreview = createApi({
    reducerPath: "dealPreview",
    baseQuery: CustomQuery(),
    refetchOnMountOrArgChange : true,
    endpoints: (builder) => ({
        getDealPreview: builder.query<dealPreview, any>({
            query: (data) => ({
                url: `/v1/deal/${data}`,
                method: "GET",
                headers: {
                    "X-Loblaw-Tenant-ID": "JOE_FRESH",
                    "x-apikey":
                        "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo=",
                },
            }),
        }),
    }),
});
export const { useGetDealPreviewQuery } = dealPreview;
