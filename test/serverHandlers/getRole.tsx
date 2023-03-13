import { rest } from 'msw'

export const handlers = [
    rest.get(`https://cs-bo-panel-bff-dev.loblaw.digital/v1/roles/pushpendra.sharma@loblaw.ca/getUserRoles`, (req, res, ctx) => {
        const mockApiResponse = {
            roles: ["CS_ADMIN", "BO_ADMIN"]
        };

        return res(ctx.json(mockApiResponse))
    }),
]

