import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const RolesOfUser = createApi({
  reducerPath: "RolesOfUser",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getRolesOfUser: builder.mutation<any[], string>({
      query: (searchValue) => ({
        url: `v1/roles/${searchValue}/getUserRoles`,
        method: "GET",
        headers: {
          "X-Loblaw-Tenant-ID": "JOE_FRESH",
          "X-Loblaw-Support-Tool-ID": "BO",
        },
      }),
    }),
  }),
});
export const { useGetRolesOfUserMutation } = RolesOfUser;
