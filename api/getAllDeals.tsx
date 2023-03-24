import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";
import { IFilters } from '../store/feature/filters/filtersSlice'

export interface AllDealsList {
  mediaUrl: string;
  dealTitle: string;
  validFrom: string;
  validTo: string;
  type: string;
  status: string;
  dealValue: [
    {
      rewardType: string,
      rewardValue: string
    }
  ],
  identifier: string;
}

export interface newAllDealsList {
  deals: AllDealsList[];
  paginationInfo: any;
}

interface IGetAllList {
  search: string,
  filters: IFilters
  page: number
}

const getUrl = (params: IGetAllList): string => {
  let url = '/v1/deals?'
  const { search, filters, page } = params
  if (search) {
    url = `${url}search_text=${search}`
  }

  if (filters) {
    const { status, dealType, endDate, startDate } = filters
    if (status && status.length > 0) {
      url = `${url}&statuses=${status.join(',')}`
    }
    if (dealType && dealType.length > 0) {
      url = `${url}&deal_types=${dealType.join(',')}`
    }
    if (startDate) {
      url = `${url}&valid_from=${startDate}`
    }
    if (endDate) {
      url = `${url}&valid_to=${endDate}`
    }
  }

  if(page) {
    url = `${url}&page_number=${page}`
  }

  return url
}

export const viewAllDeals = createApi({
  reducerPath: "viewAllDeals",
  baseQuery: CustomQuery(),
  endpoints: (builder) => ({
    getAllList: builder.query<newAllDealsList, IGetAllList>({
      query: (params) => ({
        url: getUrl(params),
        method: "GET",
        headers: {
          "X-Loblaw-Tenant-ID": "JOE_FRESH",
          "x-apikey": "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo="
        },
      }),
    }),
  }),
});
export const { useGetAllListQuery } = viewAllDeals;
