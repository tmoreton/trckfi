
export const addComma = (num) => {
  return `$${Number(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export const diffNum = (a, b) => {
return  Math.round(100 * Math.abs(( Number(a) - Number(b) ) / ( (Number(a) + Number(b))/2 ))) || 0
}