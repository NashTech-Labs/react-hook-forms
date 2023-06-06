import { rest } from "msw";

export const handlers = [
    rest.patch(
        `https://cs-bo-panel-bff-dev.loblaw.digital/v1/deal/disable`,
        (req, res, ctx) => {
            return res(ctx.json({}));
        }
    ),
];
