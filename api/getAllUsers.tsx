import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const userRoleList = createApi({
  reducerPath: "userRoleList",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getUserRoleList: builder.query<any[], void>({
      query: () => ({
        url: `v1/roles/getAllUsers`,
        method: "GET",
        headers: {
          "X-Loblaw-Tenant-ID": "JOE_FRESH",
          "X-Loblaw-App-Id" : "BO_Tool"
        },
      }),
    }),
  }),
});
export const { useGetUserRoleListQuery } = userRoleList;