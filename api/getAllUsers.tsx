import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export const userRoleList = createApi({
  reducerPath: "userRoleList",
  baseQuery: CustomQuery(),
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getUserRoleList: builder.query<any[], void>({
      query: () => ({
        url: `v1/roles/getAllUsers`,
        method: "GET",
        headers: {
          "Business-User-Agent": "PLATFORM_BO_TOOLS",
        },
      }),
    }),
  }),
});
export const { useGetUserRoleListQuery } = userRoleList;
