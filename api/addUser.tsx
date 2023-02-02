import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

interface UserDetail {
  emailId: string;
  roles: string[];
  business:string
}

export const addUser = createApi({
  reducerPath: "addUser",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    addUser: builder.mutation<any[],UserDetail>({
      query: ({business,...rest}) => ({
        url: "/v1/roles/add",
        method: "POST",
        body: rest,
        headers: {
            "X-Loblaw-Tenant-ID": `${business}`,
            "X-Loblaw-Support-Tool-ID" : "BO",
            "X-Loblaw-auth-provider": "GOOGLE",
        },
      }),
    }),
  }),
});
export const { useAddUserMutation } = addUser;

