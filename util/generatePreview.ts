import {convertCentsToDollar} from "./convertDealToFormData"

interface IGeneratePreviewForValueStep {
    level?: string
    tab?: string
    percentageOff?: string
    customPercentageOff?: string
    dollarOff?: string
    fixedPriceOff?: string
    basketSpend?: string
    basketDiscount?: string
    basketDealType?: string
}

interface IGeneratePreviewForSerializedVoucherValueStep {
    voucherLevel?: string
    voucherDiscountTab?: string
    voucherValueDollarOffCriteria?: string
    dollarOffSpend?: string
    dollarOff?: string
    dollarOffMultiBuyQuantity?: string
    dollarOffMultiBuyDiscount?: string
    pointsApplyType?: string
    dollarPointDiscount?: string
    basketpointsApplyType?: string
    basketdollarPointDiscount?: string
    fulfillmentSpend?: string
    waivefess?: string
    basketDollarOff?: string
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
    basketDealType,
}: IGeneratePreviewForValueStep): string => {
    let customerPreview = 'Preview will generate after inputs are completed'

    if(level === 'product') {
        if(tab === 'percentage' && percentageOff) {
            if(percentageOff === 'custom') {
                if(customPercentageOff) {
                    customerPreview = `${customPercentageOff}% off products(s)`
                }
            } else {
                customerPreview = `${percentageOff}% off products(s)`
            }
        } else if(dollarOff || fixedPriceOff) {
            customerPreview = `$${dollarOff || fixedPriceOff} off product(s)`
        }
    } else if(basketSpend && basketDiscount) {
        customerPreview = `Spend $${basketSpend}, Get ${basketDealType === 'dollar' ? '$' : ''}${basketDiscount}${basketDealType === 'percentage' ? '%' : ''} off`
    }

    return customerPreview
}

export const generatePreviewForSerializedVoucherValueStep = ({
    voucherLevel,
    voucherDiscountTab,
    voucherValueDollarOffCriteria,
    dollarOffSpend,
    dollarOff,
    dollarOffMultiBuyQuantity,
    dollarOffMultiBuyDiscount,
    pointsApplyType,
    dollarPointDiscount,
    basketpointsApplyType,
    basketdollarPointDiscount,
    fulfillmentSpend,
    waivefess,
    basketDollarOff
}: IGeneratePreviewForSerializedVoucherValueStep): string => {
    let customerPreview = 'Preview will generate after inputs are completed'

    if(voucherLevel === 'product') {
        if(voucherDiscountTab === 'dollar') {
            if(voucherValueDollarOffCriteria === 'MINIMUM_SPEND') {
                if(dollarOffSpend && dollarOff) {
                    customerPreview = `Spend $${convertCentsToDollar(Number(dollarOffSpend))}.00, Get $${dollarOff} off`
                }
            } else {
                if(dollarOffMultiBuyDiscount && dollarOffMultiBuyQuantity) {
                    customerPreview = `Buy ${dollarOffMultiBuyQuantity}, Get $${dollarOffMultiBuyDiscount} off`
                }
            }
        } else {
            if(pointsApplyType && dollarPointDiscount) {
                customerPreview = `Spend $${dollarPointDiscount}, Get ${pointsApplyType} points`
            }
        }
    }


    if(voucherLevel === 'basket') {
        if(voucherDiscountTab === 'dollar' && basketDollarOff) {
            customerPreview = `Get $${basketDollarOff} off products(s)`
        }
        if(voucherDiscountTab === 'points' && basketpointsApplyType && basketdollarPointDiscount) {
            customerPreview = `Spend $${basketdollarPointDiscount}, Get ${basketpointsApplyType} points`
        }

        if(voucherDiscountTab === 'fulfillment' && fulfillmentSpend) {
            customerPreview = `Spend $${fulfillmentSpend} and Get free pickup or delivery`
        }
    }

    return customerPreview
}