import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";

interface DownloadVoucherRequest {
  voucherId: string;
  username: string;
}

interface IBatch {
  id: number;
  size: number;
  created_at: string;
  updated_at: string;
  status: string;
}

interface IBatchesResponse {
  batches: Array<IBatch>;
}

export interface IDownloadVoucherResponse {
  response: IBatchesResponse;
}

export const downloadVoucherBatches = createApi({
  reducerPath: "downloadVoucherBatches",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    downloadVoucherBatches: builder.query<
      IDownloadVoucherResponse,
      DownloadVoucherRequest
    >({
      query: ({ voucherId, username }) => ({
        url: `/v1/vouchers/batches/${voucherId}`,
        method: "GET",
        headers: {
          "X-Loblaw-auth-provider": "GOOGLE",
          "Business-User-Agent": "PLATFORM_BO_TOOLS",
          "X-User-Name": username,
        },
      }),
    }),
  }),
});

export const { useDownloadVoucherBatchesQuery } = downloadVoucherBatches;
