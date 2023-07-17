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

export const icons = {
  "COFFEE": "2615",
  "FAST_FOOD": "1f35f",
  "FLIGHTS": "2708-fe0f",
  "GYMS_AND_FITNESS_CENTERS": "1f3cb-fe0f",
  "RENT": "1f3e1",
  "RESTAURANT": "1f37d-fe0f",
  "SPORTING_GOODS": "1f3c8",
  "TAXIS_AND_RIDE_SHARES": "1f695",
  "GAS_AND_ELECTRICITY": "1f4a1",
  "BEER_WINE_AND_LIQUOR": "1f37a",
  "ATM_FEES": "1f3e6",
  "INTEREST_EARNED": "1f4b0",
  "WAGES": "1f4b0",
  "PARKING": "1f697",
  "AUTOMOTIVE": "1f697",
  "OTHER_ENTERTAINMENT": "1f3df-fe0f",
  "PHARMACIES_AND_SUPPLEMENTS": "1fa79",
  "ONLINE_MARKETPLACES": "1f6d2",
  "OTHER_BANK_FEES": "1f3e6",
  "GROCERIES": "1f966",
  "ELECTRONICS": "1f3a7",
  "TV_AND_MOVIES": "1f4fa",
  "BOOKSTORES_AND_NEWSSTANDS": "1f4da",
  "MUSIC_AND_AUDIO": "1f3b5",
  "OTHER_FOOD_AND_DRINK": "1f354",
  "OTHER_TRAVEL": "1f5fa-fe0f",
  "HAIR_AND_BEAUTY": "1f487-200d-2640-fe0f",
  "OTHER_GENERAL_SERVICES": "1f937",
  "INSURANCE": "26c8-fe0f",
  "LODGING": "1f3e8"
}