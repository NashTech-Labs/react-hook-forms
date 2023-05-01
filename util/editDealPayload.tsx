
export const addScopesForEditDealPayload = (deal: any, payload: any): any[] => {
  const existingScopeValue = deal?.dealValue?.scopeValue || []
  const editedScopeValues = payload?.scopes
  if(!editedScopeValues) return existingScopeValue
  const result = [...existingScopeValue, ...editedScopeValues]
  const scopeMap = new Map()
  const uniqueScopeValues: any = []
  result.forEach(scope => {
    const { value } = scope
    if(scopeMap.has(value)) return 
    uniqueScopeValues.push(scope)
    scopeMap.set(value, 1)
  })
  return uniqueScopeValues
}

export const addPromoRestrictionsForEditDealPayload = (deal: any, payload: any): any => {
    const existingLiams = deal?.exclusion?.product?.liam
    const existingMch = deal?.exclusion?.product?.mch
    const existingPriceApplicability = deal?.applicableProducts?.priceApplicability
    const editedPromoRestrictions = payload['promo_restrictions']
    if(editedPromoRestrictions && Object.values(editedPromoRestrictions).length === 0) {
      const restrictions: any = {}
      restrictions['product_code'] = {
        liam: existingLiams
      }
      restrictions['category'] = {
        mch: existingMch
      }
      if(existingPriceApplicability) {
        restrictions['price_applicability'] = {
          value : existingPriceApplicability
        }
      }
      return restrictions
    } else {
      const editedRestrictions: any = {}
      const editedLiam = editedPromoRestrictions?.['product_code']?.liam || []
      const editedMch = editedPromoRestrictions?.['category']?.mch || []
      const editedPriceApplicability = editedPromoRestrictions?.['price_applicability']?.value
      editedRestrictions['product_code'] = {
        // @ts-ignore
        liam: [...new Set([...existingLiams, ...editedLiam ])]
      }
      editedRestrictions['category'] = {
        // @ts-ignore
        mch: [...new Set([...existingMch, ...editedMch])]
      }
      if(editedPriceApplicability) {
        editedRestrictions['price_applicability'] = {
          value : editedPriceApplicability
        }
      }
      return editedRestrictions
    }
  }