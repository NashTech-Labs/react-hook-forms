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

export interface NewAllDealsList {
  deals: AllDealsList[];
  paginationInfo: any;
}

interface IGetAllList {
  search: string,
  filters: IFilters
  page: number,
  user: any
}

const getUrl = (params: any): string => {
  let url = '/v1/deals?'
  let urlParamsObj: { [index: string]: string } = {}
  const { search, filters, page } = params
  if (search) {
    urlParamsObj = {
      'search_text': search
    }
  }

  if (filters) {
    const { status, dealType, endDate, startDate } = filters
    if (status && status.length > 0) {
      urlParamsObj = {
        ...urlParamsObj,
        statuses: status.join(',')
      }
    }
    if (dealType && dealType.length > 0) {
      urlParamsObj = {
        ...urlParamsObj,
        'deal_types': dealType.join(',')
      }
    }
    if (startDate) {
      urlParamsObj = {
        ...urlParamsObj,
        'valid_from': startDate.format()
      }
    }
    if (endDate) {
      urlParamsObj = {
        ...urlParamsObj,
        'valid_to': endDate.format().replace("T00:00:00+05:30", "T23:59:59+05:30")
      }
    }
  }

  if (page) {
    urlParamsObj = {
      ...urlParamsObj,
      'page_number': String(page)
    }
  }

  const urlParams = new URLSearchParams([...Object.entries(urlParamsObj)])

  return `${url}${urlParams.toString()}`
}

export const viewAllDeals = createApi({
  reducerPath: "viewAllDeals",
  baseQuery: CustomQuery(),
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getAllList: builder.query<NewAllDealsList, IGetAllList>({
      query: (params) => ({
        url: getUrl(params),
        method: "GET",
        headers: {
          "X-Loblaw-Tenant-ID": "JOE_FRESH",
          "x-apikey": "cGxlYXNlLWktcmVhbGx5LXdhbnQtdG8tYWNjZXNzLXBwZS1zdGFnaW5nLWFwaQo=",
          'X-User-Name': params.user.name
        },
      }),
    }),
  }),
});
export const { useGetAllListQuery } = viewAllDeals;
