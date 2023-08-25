import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

interface UserDetail {
  emailId: string;
  roles: string[];
  business: string[];
  customer_id: string;
}

export const removeUser = createApi({
  reducerPath: "removeUser",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    removeUser: builder.mutation<void, UserDetail>({
      query: (customer_id) => ({
        url: `/v1/roles/${customer_id}/removeAccess`,
        method: "PATCH",
        body: [],
        headers: {
          "X-Loblaw-Anonymize": "true",
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});
export const { useRemoveUserMutation } = removeUser;
