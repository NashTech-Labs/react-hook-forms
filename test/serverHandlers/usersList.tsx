import { rest } from 'msw'

export const handlers = [
    rest.get(`http://localhost:8080/v1/roles/getAllUsers`, (req, res, ctx) => {
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
]

