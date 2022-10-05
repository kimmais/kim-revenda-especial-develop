import VMasker from 'vanilla-masker'

export const creditCardNumber = '[0000] [0000] [0000] [0000]'
export const validity = '[00]{/}[00]'
export const cvv = '[000]'
export const cpf = '[000].[000].[000]-[00]'
export const cnpj = '[00].[000].[000]/[0000]-[00]'
export const areaCode = '[00]'
export const phoneNumber = '[00000]-[0000]'
export const zipCode = '[00000]-[000]'
export const money = {
  precision: 2,
  separator: ',',
  delimiter: '.',
  unit: 'R$',
  zeroCents: false
}
export const transportCard = '[000000000000000]'
export const token = '[0000]'

export const maskCPF = cpf => {
  let CPF = cpf
  try {
    CPF = CPF.replace(/\D/g, '')
    if (CPF.length > 11) {
      CPF = CPF.substring(0, 11)
    }
    CPF = CPF.replace(/(\d{3})(\d)/, '$1.$2')
    CPF = CPF.replace(/(\d{3})(\d)/, '$1.$2')
    CPF = CPF.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return CPF
  } catch (error) {
    console.log(error)
  }
}

export const maskHideCPF = cpf => {
  let CPF = cpf
  try {
    CPF = CPF.replace(/\D/g, '')
    if (CPF.length > 11) {
      CPF = CPF.substring(0, 11)
    }
    CPF = CPF.replace(/(\d{3})(\d)/, '$1.$2')
    CPF = CPF.replace(/(\d{3})(\d)/, '$1.$2')
    CPF = CPF.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    CPF = `${CPF.substring(0, 4)}${CPF.substring(4, 11).replace(/[0-9]/g, '*')}${CPF.substring(11)}`
    return CPF
  } catch (error) {
    console.log(error)
  }
}

export const maskCNPJ = cnpj => {
  let CNPJ = cnpj
  try {
    CNPJ = CNPJ.replace(/\D/g, '')
    if (CNPJ.length > 14) {
      CNPJ = CNPJ.substring(0, 14)
    }
    CNPJ = CNPJ.replace(/(\d{2})(\d)/, '$1.$2')
    CNPJ = CNPJ.replace(/(\d{3})(\d)/, '$1.$2')
    CNPJ = CNPJ.replace(/(\d{3})(\d)/, '$1/$2')
    CNPJ = CNPJ.replace(/(\d{4})(\d{2})$/, '$1-$2')
    return CNPJ
  } catch (error) {
    console.log(error)
  }
}

export const maskHideCNPJ = cnpj => {
  let CNPJ = cnpj
  try {
    CNPJ = CNPJ.replace(/\D/g, '')
    if (CNPJ.length > 14) {
      CNPJ = CNPJ.substring(0, 14)
    }
    CNPJ = CNPJ.replace(/(\d{2})(\d)/, '$1.$2')
    CNPJ = CNPJ.replace(/(\d{3})(\d)/, '$1.$2')
    CNPJ = CNPJ.replace(/(\d{3})(\d)/, '$1/$2')
    CNPJ = CNPJ.replace(/(\d{4})(\d{2})$/, '$1-$2')
    CNPJ = `${CNPJ.substring(0, 14).replace(/[0-9]/g, '*')}${CNPJ.substring(14)}`
    return CNPJ
  } catch (error) {
    console.log(error)
  }
}

export const maskZipCode = zipCode => {
  let ZipCode = zipCode
  try {
    ZipCode = ZipCode.replace(/\D/g, '')
    if (ZipCode.length > 8) {
      ZipCode = ZipCode.substring(0, 8)
    }
    ZipCode = ZipCode.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
    return ZipCode
  } catch (error) {
    console.log(error)
  }
}

export const maskPhoneNumber = (phoneNumber, withArea = false) => {
  let PhoneNumber = phoneNumber
  try {
    PhoneNumber = PhoneNumber.replace(/\D/g, '')
    if (withArea) {
      PhoneNumber = PhoneNumber.replace(/(\d{1,12})/, '$1')
      if (PhoneNumber.length < 11) {
        if (PhoneNumber.length < 3) {
          PhoneNumber = PhoneNumber.replace(/(\d{2})$/, '($1)')
        } else if (PhoneNumber.length < 7) {
          PhoneNumber = PhoneNumber.replace(/(\d{2})(\d{1,4})$/, '($1) $2')
        } else {
          PhoneNumber = PhoneNumber.replace(/(\d{2})(\d{4})(\d{1,4})$/, '($1) $2-$3')
        }
      } else if (PhoneNumber.length === 11) {
        PhoneNumber = PhoneNumber.replace(/(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3')
      } else {
        PhoneNumber = PhoneNumber.substring(0, 11)
        PhoneNumber = PhoneNumber.replace(/(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3')
      }
    } else {
      PhoneNumber = PhoneNumber.replace(/(\d{1,10})/, '$1')
      if (PhoneNumber.length < 9) {
        PhoneNumber = PhoneNumber.replace(/(\d{4})(\d{1,4})$/, '$1-$2')
      } else if (PhoneNumber.length === 9) {
        PhoneNumber = PhoneNumber.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
      } else {
        PhoneNumber = PhoneNumber.substring(0, 9)
        PhoneNumber = PhoneNumber.replace(/(\d{5})(\d{1,4})$/, '$1-$2')
      }
    }
    return PhoneNumber
  } catch (error) {
    console.log(error)
  }
}

export const maskAreaCode = areaCode => {
  let AreaCode = areaCode
  try {
    AreaCode = AreaCode.replace(/\D/g, '')
    AreaCode = AreaCode.replace(/(\d{2})/, '($1)')
    return AreaCode
  } catch (error) {
    console.log(error)
  }
}

export const maskValidity = validity => {
  let Validity = validity
  try {
    Validity = Validity.replace(/\D/g, '')
    Validity = Validity.replace(/(\d{2})(\d)/, '$1/$2')
    return Validity
  } catch (error) {
    console.log(error)
  }
}

export const maskDate = (date, invert) => {
  let Current = date
  try {
    Current = Current.replace(/\D/g, '')
    if (Current.length > 8) {
      Current = Current.substring(0, 8)
    }
    if (invert) {
      Current = `${Current.substring(6, 8)}${Current.substring(4, 6)}${Current.substring(0, 4)}`
    }
    Current = Current.replace(/(\d{2})(\d)/, '$1/$2')
    Current = Current.replace(/(\d{2})(\d)/, '$1/$2')
    return Current
  } catch (error) {
    console.log(error)
  }
}

export const maskDateForComplement = date => {
  let Current = date
  try {
    const array = Current.split('/')
    const day = array[0]
    const month = array[1]
    const year = array[2]
    Current = `${year}-${month}-${day}`
    return Current
  } catch (error) {
    console.log(error)
  }
}

export const maskDateFromComplement = (date, time,separator = '') => {
  let Current = date
  try {
    let array = Current.split('-')
    if (time) {
      array = Current.split('T')
      array = array[0].split('-')
    }
    const day = array[2]
    const month = array[1]
    const year = array[0]
    Current = `${day}${separator}${month}${separator}${year}`
    return Current
  } catch (error) {
    console.log(error)
  }
}

export const maskDateTimeFromComplement = current => {
  let Current = current
  try {
    const array = Current.split('T')
    const date = array[0].split('-')
    const time = array[1].split(':')
    const day = date[2]
    const month = date[1]
    const year = date[0]
    const hour = time[0]
    const min = time[1]
    Current = `${day}/${month}/${year} às ${hour}:${min} hs`
    return Current
  } catch (error) {
    console.log(error)
  }
}

export const maskDateFromDateNow = (time = false) => {
  try {
    const data = new Date()
    const dia = data.getDate().toString()
    const diaF = dia.length === 1 ? `0${dia}` : dia
    const mes = (data.getMonth() + 1).toString()
    const mesF = mes.length === 1 ? `0${mes}` : mes
    const anoF = data.getFullYear()
    if (time) {
      const hora = data.getHours().toString()
      const horaF = hora.length === 1 ? `0${hora}` : hora
      const minuto = data.getMinutes().toString()
      const minutoF = minuto.length === 1 ? `0${minuto}` : minuto
      const segundo = data.getSeconds().toString()
      const segundoF = segundo.length === 1 ? `0${segundo}` : segundo
      return `${diaF}/${mesF}/${anoF} - ${horaF}:${minutoF}:${segundoF} hs`
    }
    return `${diaF}/${mesF}/${anoF}`
  } catch (error) {
    console.log(error)
  }
}

export const maskDateFromDateTomorrowYearMonthDay = () => {
  try {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dia = String(tomorrow.getDate())
    const diaF = dia.length === 1 ? `0${dia}` : dia
    const mes = (tomorrow.getMonth() + 1).toString()
    const mesF = mes.length === 1 ? `0${mes}` : mes
    const anoF = tomorrow.getFullYear()
    return `${anoF}/${mesF}/${diaF}`
  } catch (error) {
    console.log(error)
  }
}

export const maskMoneyToLocaleString = value => {
  let moneyFilter = String(value).replace(/[^0-9]/g, '')
  moneyFilter = Number(
    moneyFilter.length >= 3
      ? `${moneyFilter.substr(0, moneyFilter.length - 2)}.${moneyFilter.substring(
          moneyFilter.length - 2,
          moneyFilter.length
        )}`
      : moneyFilter.length > 1
      ? `00.${moneyFilter}`
      : `00.0${moneyFilter}`
    // : moneyFilter.length === 1
    // ? `00.0${moneyFilter}`
    // : moneyFilter
  )

  const format = { minimumFractionDigits: 2 }

  return parseFloat(moneyFilter)
    .toFixed(2)
    .toLocaleString('pt-BR', format)
    .replace('.', ',')
}

export const removeMaskMoneyToLocaleString = value => {
  return parseFloat(String(maskMoneyToLocaleString(value)).replace(',', '.'))
}

export const maskMoney = value => {
  try {
    let Value = value
    if (!value) {
      Value = 0
    }
    return VMasker.toMoney(Value.toString(), {
      precision: 2,
      separator: ',',
      unit: '',
      delimiter: '.'
    })
  } catch (error) {
    console.log(error)
  }
}

export const maskCreditCard = card => {
  try {
    let CARD = card
    CARD = CARD.replace(/\D/g, '')
    CARD = CARD.replace(/(\d{4})(\d)/, '$1 $2')
    CARD = CARD.replace(/(\d{4})(\d)/, '$1 $2')
    CARD = CARD.replace(/(\d{4})(\d)/, '$1 $2')
    CARD = CARD.replace(/(\d{4})(\d)/, '$1 $2')

    return CARD.substr(0, 19)
  } catch (error) {
    console.log(error)
  }
}

export const removeMaskMoney = value => {
  try {
    const moneyFilter = value.replace(/[^a-z0-9+]/g, '')
    return Number(
      moneyFilter.length >= 3
        ? `${moneyFilter.substr(0, moneyFilter.length - 2)}.${moneyFilter.substring(
            moneyFilter.length - 2,
            moneyFilter.length
          )}`
        : moneyFilter.length === 1
        ? `00.0${moneyFilter}`
        : moneyFilter
    )
  } catch (error) {
    console.log(error)
  }
}

export const removeMaskZipCode = value => {
  let ZipCode = value
  ZipCode = ZipCode.replace(/\D/g, '')
  if (ZipCode.length > 8) {
    ZipCode = ZipCode.substring(0, 8)
  }
  return ZipCode
}

export const removeCPF = value => {
  try {
    let CPF = value
    CPF = CPF.replace(/\D/g, '')
    if (CPF.length > 11) {
      CPF = CPF.substring(0, 11)
    }
    return CPF
  } catch (error) {
    return null
  }

}

export const removeCNPJ = value => {
  try {
    let CNPJ = value
    CNPJ = CNPJ.replace(/\D/g, '')
    if (CNPJ.length > 14) {
      CNPJ = CNPJ.substring(0, 14)
    }
    return CNPJ
  } catch (error) {
    return null
  }

}

export const removePhoneNumber = (value, withArea = false) => {
  let PhoneNumber = value
  PhoneNumber = PhoneNumber.replace(/\D/g, '')
  if (withArea) {
    if (PhoneNumber.length > 11) {
      PhoneNumber = PhoneNumber.substring(0, 11)
    }
  } else if (PhoneNumber.length > 9) {
    PhoneNumber = PhoneNumber.substring(0, 9)
  }
  return PhoneNumber
}

export const removeValidity = value => {
  return value.replace(/\D/g, '')
}

export const maskNumber = value => {
  return value.replace(/\D/g, '')
}

export const removeCreditCardNumberMask = value => {
  return value.replace(/\D/g, '').substr(0, 16)
}

export const removeDate = value => {
  let Value = value
  Value = Value.replace(/\D/g, '')
  if (Value.length > 8) {
    Value = Value.substring(0, 8)
  }
  return Value
}

export const getCodeCellNumber = value => {
  const ddd = value.split(' ')
  return ddd[0].replace(/\D/g, '')
}

// Get Number Complet of cell phone without Formatting (MASK) - EX: 31992976011
export const getCellNumberComplete = value => {
  const cellNumberComplete = value.replace(/\D/g, '')
  return cellNumberComplete
}

export const getCellNumber = value => {
  const ddd = value.split(' ')
  return ddd[1].replace(/\D/g, '')
}

export const getCreditCardMask = card => {
  // switch (card.carrier) {
  //   case 'visa':
  //     return `Visa •••• ${card.number}`
  //   case 'mastercard':
  //     return `MasterCard •••• ${card.number}`
  //   case 'mc':
  //     return `MasterCard •••• ${card.number}`
  //   case 'elo':
  //     return `ELO •••• ${card.number}`
  //   default:
  //     return ''
  // }
  return `•••• ${card.number}`
}

export const maskEmailInput = email => {
  let Email = email
  try {
    Email = Email.split('@')
    const firstChar = Email[0].charAt(0)
    const first = `${firstChar}${Email[0].substring(1).replace(/\D/g, '*')}`
    const EmailSplit = Email[1].split('.')
    const secondChar = EmailSplit[0].charAt(0)
    let second = `${secondChar}${EmailSplit[0].substring(1).replace(/\D/g, '*')}`
    EmailSplit.forEach((part, index) => {
      if (index !== 0) {
        second += `.${part}`
      }
    })
    return `${first}@${second}`
  } catch (error) {
    console.log(error)
  }
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const maskPhoneInput = (area, phone) => {
  try {
    const areaMask = `(${area}) `
    const firstNumber = phone.charAt(0)
    const lastNumbers = phone.substring(phone.length - 2, phone.length)
    const number = `${firstNumber}${phone
      .substring(1, phone.length - 2)
      .replace(/[0-9]/g, '*')}${lastNumbers}`
    let first = null
    let second = null
    if (number.length === 9) {
      first = number.substring(0, 5)
      second = number.substring(5, number.length)
    } else {
      first = number.substring(0, 4)
      second = number.substring(4, number.length)
    }
    return `${areaMask}${first}-${second}`
  } catch (error) {
    console.log(error)
  }
}

export const maskBarCode = value => {
  try {
    let Value = value
    Value = Value.replace(/\D/g, '')
    if (Value.substring(0, 1) === '8') {
      // conta
      if (Value.length > 48) {
        Value = Value.substring(0, 48)
      }
      Value = Value.replace(/(\d{11})(\d{1})(\d)/, '$1-$2 $3')
      Value = Value.replace(/(\d{11})(\d{1})(\d)/, '$1-$2 $3')
      Value = Value.replace(/(\d{11})(\d{1})(\d)/, '$1-$2 $3')
      Value = Value.replace(/(\d{11})(\d{1})/, '$1-$2')
    } else {
      // boleto
      if (Value.length > 47) {
        Value = Value.substring(0, 47)
      }
      if (Value.length < 11) {
        Value = Value.replace(/(\d{5})(\d)/, '$1.$2')
      } else if (Value.length < 16) {
        Value = Value.replace(/(\d{5})(\d{5})(\d)/, '$1.$2 $3')
      } else if (Value.length < 22) {
        Value = Value.replace(/(\d{5})(\d{5})(\d{5})(\d)/, '$1.$2 $3.$4')
      } else if (Value.length < 27) {
        Value = Value.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d)/, '$1.$2 $3.$4 $5')
      } else if (Value.length < 33) {
        Value = Value.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d)/, '$1.$2 $3.$4 $5.$6')
      } else if (Value.length < 34) {
        Value = Value.replace(
          /(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d)/,
          '$1.$2 $3.$4 $5.$6 $7'
        )
      } else {
        Value = Value.replace(
          /(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d)/,
          '$1.$2 $3.$4 $5.$6 $7 $8'
        )
      }
    }
    return Value
  } catch (error) {
    console.log(error)
  }
}

export const removeBarCode = value => {
  let Value = value
  Value = Value.replace(/\D/g, '')
  if (Value.substring(0, 1) === '8' && Value.length > 48) {
    // conta
    Value = Value.substring(0, 48)
  } else if (Value.substring(0, 1) !== '8' && Value.length > 47) {
    // boleto
    Value = Value.substring(0, 47)
  }
  return Value
}
export const maskNumberInt = number => {
  try {
    const text = String(number);
    const transfom =  text.replace(/[^\d]/g,'');
    return transfom


  } catch (error) {
    console.log(error)
    return number
  }
}

export const getMonthString = value => {
  switch (value.toString()) {
    case '01':
      return 'jan'
    case '02':
      return 'fev'
    case '03':
      return 'mar'
    case '04':
      return 'abr'
    case '05':
      return 'mai'
    case '06':
      return 'jun'
    case '07':
      return 'jul'
    case '08':
      return 'ago'
    case '09':
      return 'set'
    case '10':
      return 'out'
    case '11':
      return 'nov'
    case '12':
      return 'dez'
    default:
      break
  }
}

export const getExpiringMonth = value => {
  switch (value) {
    case 'january':
      return 'Janeiro'
    case 'february':
      return 'Fevereiro'
    case 'march':
      return 'Março'
    case 'april':
      return 'Abril'
    case 'may':
      return 'Maio'
    case 'june':
      return 'Junho'
    case 'july':
      return 'Julho'
    case 'august':
      return 'Agosto'
    case 'september':
      return 'Setembro'
    case 'october':
      return 'Outubro'
    case 'november':
      return 'Novembro'
    case 'december':
      return 'Dezembro'
    default:
      break
  }
}
