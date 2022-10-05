// import valid from 'card-validator'
import { isCPF, isCNPJ } from 'brazilian-values'
import { removeDate } from './mask.util'

export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}

export function validateCPF(cpf) {
  // return validateCPFLib(cpf)
  const CPF = cpf.replace(/[^\d]+/g, '')
  var a = isCPF(CPF)
  return isCPF(CPF)
}

export function validateCNPJ(cnpj) {
  const CNPJ = cnpj.replace(/[^\d]+/g, '')
  console.log(CNPJ)
  console.log(isCNPJ(CNPJ))
  return isCNPJ(CNPJ)
  // // eslint-disable-next-line no-param-reassign
  // cnpj = cnpj.replace(/[^\d]+/g, '')
  // if (cnpj === '') return false
  // if (cnpj.length !== 14) {
  //   return false
  // }
  // if (
  //   cnpj === '00000000000000' ||
  //   cnpj === '11111111111111' ||
  //   cnpj === '22222222222222' ||
  //   cnpj === '33333333333333' ||
  //   cnpj === '44444444444444' ||
  //   cnpj === '55555555555555' ||
  //   cnpj === '66666666666666' ||
  //   cnpj === '77777777777777' ||
  //   cnpj === '88888888888888' ||
  //   cnpj === '99999999999999'
  // ) {
  //   return false
  // }
  // let tamanho = cnpj.length - 2
  // let numeros = cnpj.substring(0, tamanho)
  // const digitos = cnpj.substring(tamanho)
  // let soma = 0
  // let pos = tamanho - 7
  // for (let i = tamanho; i >= 1; i--) {
  //   soma += numeros.charAt(tamanho - i) * pos--
  //   if (pos < 2) {
  //     pos = 9
  //   }
  // }
  // let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  // if (resultado !== digitos.charAt(0)) {
  //   return false
  // }
  // console.log(cnpj)
  // tamanho += 1
  // numeros = cnpj.substring(0, tamanho)
  // soma = 0
  // pos = tamanho - 7
  // for (let i = tamanho; i >= 1; i--) {
  //   soma += numeros.charAt(tamanho - i) * pos--
  //   if (pos < 2) {
  //     pos = 9
  //   }
  // }
  // resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  // if (resultado !== digitos.charAt(1)) {
  //   return false
  // }
  // return true
}

export function validateNumber(number) {
  return typeof number === 'number'
}

export function validateNumberMax(number, max) {
  return number <= max
}

export function validateNumberMin(number, mim) {
  return number >= mim
}

export function validateHasUppercase(text) {
  const hasUppercaseRegex = /.*[A-Z]+.*/g
  return hasUppercaseRegex.test(text)
}

export function validateHasLowercase(text) {
  const hasLowercaseRegex = /.*[a-z]+.*/g
  return hasLowercaseRegex.test(text)
}

export function validateHasNumber(text) {
  const hasNumberRegex = /.*[0-9]+.*/g
  return hasNumberRegex.test(text)
}

export function validateHasCharacter(text) {
  const hasNumberRegex = /.*[a-zA-Z]+.*/g
  return hasNumberRegex.test(text)
}

export function validateOnlyNumber(text) {
  return text.replace(/\D/g, '')
}

export function validateMinLength(text, minLength) {
  return text.length >= minLength
}

export function validateMaxLength(text, minLength) {
  return text.length <= minLength
}

export function validateLength(text, length) {
  return text.length === length
}

// export function validateCreditCardNumber(number) {
//   return valid.number(number)
// }

export function validatePasswordConfirmation(passWord, passWordConfirmation) {
  return passWord === passWordConfirmation && passWord !== null
}

export function validateMinMaxValueMoney(text, minValue, maxValue) {
  if (text === null || text === '' || text === false) {
    return false
  } else {
    const money = parseFloat(text.replace(/\D/g, ''))
    return money >= minValue.replace(/\D/g, '') && money <= maxValue.replace(/\D/g, '')
  }
}

export function validateSelectedCard(card) {
  if (!card) {
    return false
  } else if (card < 10 || card > 200) {
    return false
  } else {
    return true
  }
}

export function validateObjectNotEmpty(obj) {
  return Object.keys(obj).length > 0
}

export function returnValueFromObjectInArray(property, array, value, get) {
  let result = null
  array.forEach(element => {
    if (element[property] === value) {
      result = element[get]
    }
  })
  return result
}

export function validateAreaCode(area) {
  return area.length === 2 && area !== '00'
}

export function validatePhoneNumber(phone, withArea = false) {
  return withArea
    ? validateMinLength(phone, 10) && validateMaxLength(phone, 11)
    : validateMinLength(phone, 8) && validateMaxLength(phone, 9)
  // phone !== '00000000' &&
  // phone !== '000000000'
}

export function validateDate(value) {
  const day = value.substring(0, 2)
  const month = value.substring(2, 4)
  const year = value.substring(4, 8)
  if (
    day === '00' ||
    month === '00' ||
    year === '0000' ||
    ((month === '04' || month === '06' || month === '09' || month === '11') && day === '31') ||
    (month === '02' && (day === '30' || day === '31'))
  ) {
    return false
  }
  const dateformat = /^([0-2][0-9]|(3)[0-1])(((0)[0-9])|((1)[0-2]))\d{4}$/
  return dateformat.test(removeDate(value))
}

export function compareDate(firstDate, comparison, secondDate) {
  // firstDate
  const dateFirst = new Date()
  const dayFirst = parseInt(removeDate(firstDate).substring(0, 2), 10)
  const monthFirst = parseInt(removeDate(firstDate).substring(2, 4), 10)
  const yearFirst = parseInt(removeDate(firstDate).substring(4, 8), 10)
  dateFirst.setFullYear(yearFirst, monthFirst - 1, dayFirst)
  const dateSecond = new Date()
  if (secondDate !== 'now') {
    // secondDate
    const daySecond = parseInt(removeDate(secondDate).substring(0, 2), 10)
    const monthSecond = parseInt(removeDate(secondDate).substring(2, 4), 10)
    const yearSecond = parseInt(removeDate(secondDate).substring(4, 8), 10)
    dateSecond.setFullYear(yearSecond, monthSecond - 1, daySecond)
  }
  if (comparison === 'bigger') {
    return dateFirst > dateSecond
  } else if (comparison === 'equal') {
    return dateFirst === dateSecond
  } else {
    return dateFirst < dateSecond
  }
}
