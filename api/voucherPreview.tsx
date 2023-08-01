import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface voucherPreview {
    voucherGeneralInfo: any;
    vouchersDateInEffect: any;
    voucherValues: any;
    voucherExclusions: any;
    vouchersProductsAndCollections: any;
}

export const voucherPreviewAPI = createApi({
    reducerPath: "voucherPreviewAPI",
    baseQuery: CustomQuery(),
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getVoucherPreview: builder.query<voucherPreview, any>({
            query: (data) => ({
                url: `/v1/vouchers/${Number(data.voucherId)}`,
                method: "GET",
                headers: {
                    "X-Loblaw-Tenant-ID": "JOE_FRESH",
                    'X-User-Name': data.user.name
                },
            }),
        }),
    }),
});
export const { useGetVoucherPreviewQuery } = voucherPreviewAPI;
