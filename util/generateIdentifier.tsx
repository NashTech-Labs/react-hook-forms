import {IDENTIFIER_MAX_SIZE} from '../constants/FormOptions'

const generateIdentifier = (): string => {
    const allowedValues = '0123456789abcdefghijklmnopqrstuvwxyz'
    let randomString = ''
    for(let i = 0; i < IDENTIFIER_MAX_SIZE; i++) {
        const randomIndex = Math.floor(Math.random() * allowedValues.length)
        randomString += allowedValues[randomIndex]
    }
    return randomString
}

export default generateIdentifier