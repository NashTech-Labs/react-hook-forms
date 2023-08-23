import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface LobsRoleData {
  JOE_FRESH: string[];
  SHOPPERS_DRUG_MART: string[];
  ONLINE_GROCERIES: string[]
}

export const userLobs = createApi({
  reducerPath: "userLobs",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getUserLobs: builder.query<LobsRoleData, string>({
      query: (email) => ({
        url: `/v1/roles/${email}/getUserLobs`,
        method: "GET",
        headers: {
          "X-CallType": "LOB",
        },
      }),
    }),
  }),
});
export const { useGetUserLobsQuery } = userLobs;
