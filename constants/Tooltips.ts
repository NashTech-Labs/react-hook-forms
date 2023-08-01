const TOOLTIP_TEXT: { [key: string]: string } = {
    TITLE: 'The title is an internal descriptor for the deal.',
    DESCRIPTION: 'The description is used to provide additional context to the deal.',
    PRIORITY: 'Priority defines which deal is applied first when multiple deals are valid on a given deal. Lower number means higher Priority.',
    STACKING_TYPE: 'Stacking type determines how deals will be visible to customers based on a set of criteria.',
    DEAL_LEVEL: 'Product refers to the individual item (LIAMs). Basket refers to the customer’s full order in their cart. Deals must specify how they apply.',
    DOLLAR_OFF: 'Dollar ($) off value is in CAD.',
    FIXED_PRICE: 'Fixed price value sets the exact dollar figure for all products in deal.',
    MCH : 'An MCH is a code used to group a set of LIAMs or individual products. It often begins with the letter ‘M’.',
    LIAM: 'A LIAM is a unique identifier for individual products.',
    COLLECTION: 'Collections refer to a set of products centred around a theme or category. For example, the Fallwear collection for Men’s',
    ENGLISH_PROMOTION: 'This is a customer-facing note shared to browsers with language settings on English. Message can be customized as needed.',
    FRENCH_PROMOTION: 'This is a customer-facing note shared to browsers with language settings on French. Message can be customized as needed.',
    DEAL_TOGGLE: 'A completed deal can be marked as Active (Currently customer facing), or be taken down by switching to Disabled.',
    VOUCHER_QUANTITY: 'The maximum number of vouchers that will be dispensed to customers. Can be added upon later',
    VOUCHER_USAGE: 'The number of times the customer can use the voucher'
}

export default TOOLTIP_TEXT