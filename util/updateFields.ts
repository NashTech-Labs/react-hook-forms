interface IUpdateAndClearErrors {
    fields: Array<string>
    setValue: Function
    clearErrors: Function
}

export const updateAndClearErrors = ({ fields, setValue, clearErrors }: IUpdateAndClearErrors) : void => {
 fields.forEach(field => {
    setValue(field, '')
 })
 clearErrors(fields)
}