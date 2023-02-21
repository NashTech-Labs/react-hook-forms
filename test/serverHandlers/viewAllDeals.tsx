import { rest } from 'msw'

export const handlers = [
    rest.get(`https://cs-bo-panel-bff-dev.loblaw.digital/v1/deals`, (req, res, ctx) => {
        const mockApiResponse = [
            {
                dealTitle:"Test deal",
                dealValue:[
                    {
                        rewardType: "%_OFF", 
                        rewardValue: "10"
                    }
                ],
                id:20,
                identifier:"16cbf213-b8b4-4dfc-a49c-912f2c4fddd9",
                status:"DRAFT",
                type:"DISCOUNT",
                validFrom:"2023-01-15T00:00:00",
                validTo:"2023-01-15T00:00:00"
            }
        ];

        return res(ctx.json(mockApiResponse))
    }),
]

