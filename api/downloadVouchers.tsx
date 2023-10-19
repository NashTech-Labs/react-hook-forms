import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { baseURL } from "../httpInterceptors";
import { RootState } from "../store";

interface IBatchResponse {
  data?: Array<string>;
  error?: any;
}

const getCodes = async (
  _queryApi: BaseQueryApi,
  fetchWithBQ: Function,
  batchId: number,
  voucherId: number
) => {
  const state = _queryApi.getState() as RootState;
  const token = state.user.token;
  const lob = state.lob.lob;

  return fetchWithBQ({
    url: `/v1/vouchers/${voucherId}/batches/${batchId}/csv`,
    method: "GET",
    headers: {
      "X-Loblaw-auth-provider": "GOOGLE",
      "Business-User-Agent": "PLATFORM_BO_TOOLS",
      "X-User-Name": "Sree Harsha Palli",
      "X-Loblaw-Support-Tool-ID": "BO",
      Authorization: `${"Bearer"} ${token}`,
      "X-Loblaw-Tenant-ID": lob?.toUpperCase().replace(/ /g, "_"),
    },
  });
};

export const downloadVoucher = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (build) => ({
    downloadVoucher: build.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const { voucherId, batchIds } = _arg;
        const ids = batchIds;
        const promises = [];
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          promises.push(getCodes(_queryApi, fetchWithBQ, id, voucherId));
        }
        const response: Array<IBatchResponse> = await Promise.all(promises);
        const isError = response.some(({ error }) => error);
        if (isError) {
          return response?.[0]?.error;
        }
        const combinedResponse = response.reduce(
          (acc, cur) => {
            const { data } = cur;
            data?.shift();
            return acc.concat(data || []);
          },
          ["code"]
        );
        return {
          data: combinedResponse,
        };
      },
    }),
  }),
});

export const { useDownloadVoucherQuery, useLazyDownloadVoucherQuery } =
  downloadVoucher;
