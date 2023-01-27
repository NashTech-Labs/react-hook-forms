import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store/index";

const baseURL = "http://localhost:8080"

export const CustomQuery = () =>
    fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;

            headers.set("Authorization", `${"Bearer"} ${token}`);
            return headers;
        }
})