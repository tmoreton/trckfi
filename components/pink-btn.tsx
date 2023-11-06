export const PinkBtn = ({ children, onClick, type }) => {
  return (
    <button
      type={ type || "button"}
      onClick={onClick} 
      className="items-center rounded-3xl inline-flex w-full justify-center bg-pink-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto">
      {children}
    </button>
  )
}

export const InverseBtn = ({ children, onClick, type }) => {
  return (
    <button
      type={ type || "button"}
      onClick={onClick} 
      className="items-center rounded-3xl inline-flex w-full justify-center bg-white px-4 py-2 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-600 hover:text-white sm:w-auto">
      {children}
    </button>
  )
}