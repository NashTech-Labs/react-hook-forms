import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {RootState} from "./store/index";

//  const baseURL = "http://localhost:8080"

// const baseURL = "https://cs-bo-panel-bff-sit.loblaw.digital"

const baseURL = process.env.NEXT_PUBLIC_BFF_ENDPOINT

export const CustomQuery = () =>
    fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders: (headers, {getState}) => {
            headers.set("X-Loblaw-Support-Tool-ID", "BO");
            const state = getState() as RootState
            const token = state.user.token;

            headers.set("Authorization", `${"Bearer"} ${token}`);
            return headers;
        }
    })
