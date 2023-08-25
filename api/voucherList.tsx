import { createApi } from "@reduxjs/toolkit/query/react";
import { CustomQuery } from "../httpInterceptors";
import { IFilters } from "../store/feature/voucher/voucherFilterSlice";

export interface AllVoucherList {
    mediaUrl: string;
    code: string;
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
    voucherId: string;
}

export interface NewAllVoucherList {
    listOfVouchers: AllVoucherList[];
    paginationInfo: any;
}

export interface GetAllVoucher {
    search: string
    filters: IFilters
    page: number
    user: any
}

const getUrl = (params: any): string => {
    let url = 'v1/vouchers?'
    let urlParamsObj: { [index: string]: string } = {}
    const { search, filters, page } = params
    if (search) {
        urlParamsObj = {
            'search_text': search.toUpperCase()
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
                'voucher_types': dealType.join(',')
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

export const voucherList = createApi({
    reducerPath: "allVoucherList",
    baseQuery: CustomQuery(),
    endpoints: (builder) => ({
        getVoucherList: builder.query<NewAllVoucherList, GetAllVoucher>({
            query: (params) => ({
                url: getUrl(params),
                method: "GET",
                headers: {
                     "X-User-Name": params.user.name
                },
            }),
        }),
    }),
});
export const { useGetVoucherListQuery } = voucherList;