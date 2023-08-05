export const PinkBtn = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick} 
      className="items-center inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto">
      {children}
    </button>
  )
}

export const InverseBtn = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick} 
      className="items-center inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-600 hover:text-white sm:w-auto">
      {children}
    </button>
  )
}