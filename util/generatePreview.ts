
interface IGeneratePreviewForValueStep {
    level: string
    tab: string
    percentageOff: string
    customPercentageOff: string
    dollarOff: string
    fixedPriceOff: string
    basketSpend: string
    basketDiscount: string
    basketDealType: string
}

export const generatePreviewForValueStep = ({
    level,
    tab,
    percentageOff,
    customPercentageOff,
    dollarOff,
    fixedPriceOff,
    basketSpend,
    basketDiscount,
    basketDealType
} : IGeneratePreviewForValueStep) : string => {
    let customerPreview = 'Preview will generate after inputs are completed'

    if (level === 'product') {
        if (tab === 'percentage' && percentageOff) {
            if (percentageOff === 'custom') {
                if (customPercentageOff) {
                    customerPreview = `${customPercentageOff}% off products(s)`
                }
            } else {
                customerPreview = `${percentageOff}% off products(s)`
            }
        } else if (dollarOff || fixedPriceOff) {
            customerPreview = `$${dollarOff || fixedPriceOff} off product(s)`
        }
    } else if (basketSpend && basketDiscount) {
        customerPreview = `Spend $${basketSpend}, Get ${basketDealType === 'dollar' ? '$' : ''}${basketDiscount}${basketDealType === 'percentage' ? '%' : ''} off`
    }

    return customerPreview
}