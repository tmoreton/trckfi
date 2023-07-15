export const addComma = (num) => {
  return `$${Number(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export const diffNum = (a, b) => {
  return  Math.round(100 * Math.abs(( Number(a) - Number(b) ) / ( (Number(a) + Number(b))/2 ))) || 0
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatAmount = (accounts, account_id, amount) => {
  let { type } = accounts.find(a => a.account_id === account_id)
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