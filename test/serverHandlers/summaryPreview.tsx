import { rest } from "msw";

export const handlers = [
    rest.get(
        `https://cs-bo-panel-bff-dev.loblaw.digital/v1/deal/657`,
        (req, res, ctx) => {
            const mockApiResponse = {
                generalDealInfo: {
                    type: "MULTI_BUY",
                    id: 657,
                    title: "New Test Deal Product",
                    code: "6301dd38-f1b8-4698-88b3-3995b8053b24",
                    description: "New Test Deal Product",
                    priority: 50,
                    stacking_type: "ALWAYS_APPLY",
                    valid_from: "2023-03-09T05:00:00",
                    valid_to: "2023-03-10T05:00:00",
                    promotion_message_english: "English Message",
                    promotion_message_french: "French Message",
                    username: "Pushpendra Sharma",
                    status: "ACTIVE",
                    created_at: "2023-03-07T10:43:16.473966",
                },
                applicableProduct: { priceApplicability: { value: "REGULAR_ONLY" } },
                exclusion: {
                    product: {
                        liam: ["S3WR034273006_EA", "S3WR034273006_EA"],
                        mch: ["M08430602", "M08431906"],
                    },
                },
                dealValue: {
                    scopeType: "PRODUCT",
                    scopeValue: [
                        {
                            type: "CATEGORY",
                            value: "M08430602",
                            sub_type: "MCH",
                        },
                        {
                            type: "PRODUCT_CODE",
                            value: "S3WR034273006_EA",
                            sub_type: "LIAM",
                        },
                        {
                            type: "PRODUCT_CODE",
                            value: "S3WR034273007_EA",
                            sub_type: "LIAM",
                        },
                        {
                            type: "PRODUCT_CODE",
                            value: "S3WR034273008_EA",
                            sub_type: "LIAM",
                        }
                    ],
                    rewardType: "$_OFF",
                    spend: null,
                    rewardsValue: [
                        {
                            value: "1000",
                            "restrictions": {
                                "quantity": {
                                    "minimum": 2,
                                    "maximum": 2
                                }
                            }
                        },
                        {
                            "value": "2000",
                            "restrictions": {
                                "quantity": {
                                    "minimum": 3,
                                    "maximum": 3
                                }
                            }
                        },
                        {
                            "value": "3000",
                            "restrictions": {
                                "quantity": {
                                    "minimum": 4,
                                    "maximum": null
                                }
                            }
                        }
                    ],
                    dealCriteriaType: null,
                    shippingMethod: null,
                    minSpend: null,
                    tierList: null,
                },
            };
            return res(ctx.json(mockApiResponse));
        }
    ),
];
