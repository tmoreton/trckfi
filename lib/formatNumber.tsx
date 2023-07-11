
export const addComma = (num) => {
  return `$${Number(num).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

export const diffNum = (a, b) => {
  return  Math.round(100 * Math.abs(( Number(a) - Number(b) ) / ( (Number(a) + Number(b))/2 ))) || 0
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

// export const type = (type, num) => {
//   switch (type) {
//     case 'credit' || 'loan':
//       return -Math.abs(num)
//     case 'depository' || 'loan':

//     default:
//       console.log(`Sorry, we are out of ${expr}.`);
//   }
// }

// Math.abs(num) => Always positive
// -Math.abs(num) => Always negative