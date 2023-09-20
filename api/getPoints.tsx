import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

interface rewardIncrementResponse {
  reward_increments_exist: Boolean
  reward_increments: string[]
}

export interface getPointsData {
  rewardIncrementResponse: rewardIncrementResponse
}

interface userObject {
  name: string
}

interface typedata {
  voucherDiscountTab: string, 
  user: userObject
}

const getTabType = (type: string) => {
  if (type === 'dollar')
  {
    return '$_OFF'
  }
  if (type === 'points')
  {
    return 'POINTS'
  }
}

export const getPoints = createApi({
  reducerPath: "getPoints",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getPoints: builder.query<getPointsData, typedata>({
      query: (data) => ({
        url: `/v1/vouchers/rewards-values?reward_type=${getTabType(data?.voucherDiscountTab)}&promotion_type=VOUCHER`,
        method: "GET",
        headers: {
          "X-User-Name": data.user.name,
        },
      }),
    }),
  }),
});
export const { useGetPointsQuery } = getPoints;
