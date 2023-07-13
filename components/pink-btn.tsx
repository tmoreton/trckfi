// type Props = {
//   onClick?: React.ReactNode,
//   children: React.ReactNode
// }
// import React, { useEffect, useState } from 'react';

export default function ({ children, onClick }) {
  // const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 1000)
  // }, [onClick])

  return (
    <button
      type="button"
      onClick={onClick} 
      className="inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto">
      {children}
    </button>
  )
}