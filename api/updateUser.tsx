import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

export interface IRolesPayload { 
  roles_to_add?: string[]
  roles_to_remove?: string[]
}

interface IUpdateUser {
    user: {
        emailId: string
        roles: string[]
        business: string[]
        customerId: string
    }
    payload: IRolesPayload
}

export const updateUser = createApi({
    reducerPath: "updateUser",
    baseQuery: CustomQuery(),
    endpoints: (builder) => ({
        updateUser: builder.mutation<void, IUpdateUser>({
            query: ({ user: { customerId }, payload }) => ({
                url: `/v1/roles/${customerId}/updateRoles`,
                method: "PATCH",
                body: payload,
                headers: {
                    "X-Loblaw-Tenant-ID": `JOE_FRESH`,
                    "Content-Type": "application/json",
                },
            }),
        }),
    }),
});
export const { useUpdateUserMutation } = updateUser;
