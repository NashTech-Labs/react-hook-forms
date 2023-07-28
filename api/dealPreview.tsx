import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface DealPreview {
    generalDealInfo: any;
    applicableProduct: any;
    exclusion: any;
    dealValue: any;
}

export const dealPreview = createApi({
    reducerPath: "dealPreview",
    baseQuery: CustomQuery(),
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getDealPreview: builder.query<DealPreview, any>({
            query: (data) => ({
                url: `/v1/deal/${data.dealId}`,
                method: "GET",
                headers: {
                    "X-Loblaw-Tenant-ID": "JOE_FRESH",
                    "x-apikey":
                        "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo=",
                    'X-User-Name': data.user.name
                },
            }),
        }),
    }),
});
export const { useGetDealPreviewQuery } = dealPreview;
