import { rest } from 'msw'

export const handlers = [
    rest.get(`https://cs-bo-panel-bff-dev.loblaw.digital/v1/roles/getAllUsers`, (req, res, ctx) => {
        const mockApiResponse = [
            {
                customerId:"de4e7f17-69f3-4b73-a3c0-93fafb9636c3",
                emailId:"mytest@gmail.com",
                profiles:[
                    {
                        JOE_FRESH:{
                            roles:[
                                "BO_ADMIN"
                            ]
                        }
                    }
                ]
            }
        ];

        return res(ctx.json(mockApiResponse))
    }),
    rest.post(`https://cs-bo-panel-bff-dev.loblaw.digital/v1/roles/add`, (req, res, ctx) => {
        return res(ctx.json({}))
    }),
    rest.patch(`https://cs-bo-panel-bff-dev.loblaw.digital/v1/roles/undefined/updateRoles`, (req, res, ctx) => {
        return res(ctx.json({}))
    }),
]

