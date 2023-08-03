export const addComma = (num) => {
  if(!num) return `$0`
  return `$${Number(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export const diffNum = (a, b) => {
  return  Math.round(100 * Math.abs(( Number(a) - Number(b) ) / ( (Number(a) + Number(b))/2 ))) || 0
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatAmount = (type, amount) => {
  if(type === 'credit' || type === 'loan'){
    if(Number(amount) < 0){
      return { amount: Number(Math.abs(amount)).toFixed(2) }
    }
    return { amount: Number(-Math.abs(amount)).toFixed(2) }
  } else {
    if(Number(amount) > 0){
      return { amount: Number(-Math.abs(amount)).toFixed(2) }
    }
    return { amount: Number(Math.abs(amount)).toFixed(2) }
  }
}

export const getAmount = (account) => {
  const { type, balances } = account
  if(type === 'credit' || type === 'loan'){
    return Number(-Math.abs(balances.current)).toFixed(2)
  } else {
    return Number(Math.abs(balances.current)).toFixed(2)
  }
}

const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
export const validateEmail = (email) => {
  return email.match(regex)
};