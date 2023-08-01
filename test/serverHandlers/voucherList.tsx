import { rest } from "msw";

export const handlers = [
    rest.get(
        `https://cs-bo-panel-bff-dev.loblaw.digital/v1/vouchers`,
        (req, res, ctx) => {
            const mockApiResponse = {
                listOfVouchers: [
                    {
                        status: "ACTIVE",
                        type: "PROMOTIONAL",
                        validFrom: "2023-06-07T17:40:36.233",
                        validTo: "2023-06-11T17:40:36.233",
                        code: "SHASH",
                        voucherId: "39",
                        voucherValues: [{
                            rewardType: "$_OFF",
                            rewardValue: "100"
                        }]
                    },
                ],
                paginationInfo: {
                    current_page: 1,
                    total_pages: 4,
                    current_page_result_count: 20,
                    total_result_count: 73,
                    sort_order: "DESC",
                    sort_by: "MOST_RECENT",
                },
            };

            return res(ctx.json(mockApiResponse));
        }
    ),
];
