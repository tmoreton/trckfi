import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LoginBtn from './login-btn'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'My Dashboard', href: '/dashboard' },
]

export default function () {
  const [show, setShow] = useState(false)
  const router = useRouter()
  const currentRoute = router.pathname

  return (
    <nav className="flex items-center justify-between flex-wrap p-6">
      <div className="flex items-center flex-shrink-0 mr-6">
        <Link href="/" className="-m-1.5 p-1.5 flex justify-center items-center">
          <svg className="h-12 w-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="75" height="75" ><path fill="#db2777" d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7H256c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96h32l-18.8 75.1c15.8 14.8 28.7 32.8 37.5 52.9H544c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H512c-9.1 12.1-19.9 22.9-32 32v64c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H256v32c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V416c-34.9-26.2-58.7-66.3-63.2-112H68c-37.6 0-68-30.4-68-68s30.4-68 68-68h4c13.3 0 24 10.7 24 24s-10.7 24-24 24H68c-11 0-20 9-20 20s9 20 20 20H99.2c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2H384zm64 136c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24z"/></svg>
          <h1 className="ml-3 text-3xl font-semibold font-semibold leading-6 text-gray-900">Trckfi</h1>
        </Link>
      </div>
      
      <div className="block lg:hidden">
        <button onClick={() => setShow(!show)} className="flex items-center px-3 py-2 border rounded text-pink-600 border-pink-600">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>
      
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className={show && 'hidden'}>
          <div className="text-sm lg:flex-grow">
            {navigation.map((item) => (
              <Link href={item.href} key={item.name} className={currentRoute === item.href ? "block mt-4 lg:inline-block lg:mt-0 mr-4 font-bold text-pink-600" : "block mt-4 lg:inline-block lg:mt-0 mr-4 text-gray-900"}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          <LoginBtn />
        </a>
      </div>
    </nav>
  )
}