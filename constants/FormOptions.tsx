export const stackTypeOptions: { [index: string]: string } = {
    'best_apply': 'Best Apply',
    'always_apply': 'Always Apply',
    'override': 'Override'
}

export const IDENTIFIER_MAX_SIZE = 15

export const dealApplyOptions: { [index: string]: string } = {
    'all': 'All',
    'regular_priced_only': 'Regular priced only'
}

export const dealLevelOptions = [
    { value: 'product', label: 'Product' },
    { value: 'basket', label: 'Basket' }
]

export const dealTabs = [
    { label: 'Dollar ($) off', value: 'dollar' },
    { label: 'Percentage (%) off', value: 'percentage' },
    { label: 'Fixed price', value: 'fixed' }
]

export const percentageOptions = [
    { value: '10', label: '10%' },
    { value: '20', label: '20%' },
    { value: '25', label: '25%' },
    { value: '40', label: '40%' },
    { value: 'custom', label: 'Add custom value' }
]

export const productCollectionTabs = [
    { label: "Upload product(s)", value: "uploadProduct" },
    { label: "Manually add product(s)", value: "addProduct" },
];

export const dealLevelExclusionOptions = [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
]

export const DEAL_APPLY_TYPE: { [index: string]: string } = {
    'all': 'ALL',
    'regular_priced_only': 'REGULAR_ONLY'
}

export const STACKING_TYPES: { [index: string]: string } = {
    'override' : 'OVERRIDE',
    'always_apply': 'ALWAYS_APPLY',
    'best_apply': 'BEST_APPLIES'
}