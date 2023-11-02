import { useState } from 'react'
import ManualModal from '../components/modals/add-manually-modal'
import StockModal from '../components/modals/stock-modal'
import HomeModal from '../components/modals/home-modal'
import CryptoModal from '../components/modals/crypto-modal'
import { useSession } from "next-auth/react"
import { PlusIcon } from '@heroicons/react/20/solid'
import PlaidLink from './plaid-link';

export default function ({ refresh, syncPlaid }) {
  const [openHome, setOpenHome] = useState(false)
  const [openStock, setOpenStock] = useState(false)
  const [openCrypto, setOpenCrypto] = useState(false)
  const [openManually, setOpenManually] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const showError = () => {
    console.log('error')
  }

  return (
    <>
      <StockModal showError={showError} open={openStock} setOpen={setOpenStock} user={user} getNetWorth={refresh}/>
      <CryptoModal showError={showError} open={openCrypto} setOpen={setOpenCrypto} user={user} getNetWorth={refresh}/>
      <HomeModal showError={showError} open={openHome} setOpen={setOpenHome} user={user} getNetWorth={refresh}/>
      <ManualModal showError={showError} open={openManually} setOpen={setOpenManually} user={user} getNetWorth={refresh} />
      <div className="lg:flex justify-center lg:space-x-6 space-x-0 items-center">
        <PlaidLink user={user} showError={showError} refresh_access_token={null} syncPlaid={syncPlaid}/>
        <button onClick={() => setOpenStock(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-md font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
          <PlusIcon className="h-6 w-6 mr-1 font-semibold" aria-hidden="true" />
          Stock
        </button>
        <button onClick={() => setOpenHome(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-md font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
          <PlusIcon className="h-6 w-6 mr-1 font-semibold" aria-hidden="true" />
          Home Value
        </button>
        <button  onClick={() => setOpenCrypto(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-md font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
          <PlusIcon className="h-6 w-6 mr-1 font-semibold" aria-hidden="true" />
          Crypto
        </button>
        <button  onClick={() => setOpenManually(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-md font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
          <PlusIcon className="h-6 w-6 mr-1 font-semibold" aria-hidden="true" />
          Manually
        </button>
      </div>
    </>
  )
}
