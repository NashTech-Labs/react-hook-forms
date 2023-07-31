import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

interface userProfileData {
    name: string
}

interface IDisablePromotionsQuery {
    promoType: string
    manageLob: string
    identifier: string
    userName: userProfileData
}

interface IDisablePromotionsResult {
   message: string
}

export const disablePromotions = createApi({
    reducerPath: "disablePromotions",
    baseQuery: CustomQuery(),
    endpoints: (builder) => ({
        disablePromotion: builder.mutation<IDisablePromotionsResult, IDisablePromotionsQuery>({
            query: ({ promoType, identifier, manageLob, userName }) => ({
                url: `v1/deal/disable?promo_type=${promoType.toLowerCase()}&identifier=${identifier}&manage_lob=${manageLob}`,
                method: "PATCH",
                headers: {
                    "X-Loblaw-Tenant-ID": `JOE_FRESH`,
                    "x-apikey": "6bbd4e6c-ae21-40b3-add3-91240bb07db0",
                    'X-User-Name': userName.name
                },
            }),
        }),
    }),
});
export const { useDisablePromotionMutation } = disablePromotions;

