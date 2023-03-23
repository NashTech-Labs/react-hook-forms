import { rest } from "msw";

export const handlers = [
  rest.get(
    `https://cs-bo-panel-bff-dev.loblaw.digital/v1/deals`,
    (req, res, ctx) => {
      const mockApiResponse = {
        deals: [
          {
            dealTitle: "Test deal",
            dealValue: [
              {
                rewardType: "%_OFF",
                rewardValue: "10",
              },
            ],
            id: 20,
            identifier: "16cbf213-b8b4-4dfc-a49c-912f2c4fddd9",
            status: "DRAFT",
            type: "DISCOUNT",
            validFrom: "2023-01-15T00:00:00",
            validTo: "2023-01-15T00:00:00",
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
