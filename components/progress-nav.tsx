import Link from 'next/link'
import Image from 'next/image'

export default function ({ width }) {
  return (
    <div className="bg-white w-full z-10 mb-20">
      <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
        <Image
          src='/trckfi-logo-beta.png'
          alt='Trckfi'
          width={150}
          height={100}
          className="py-4 mx-auto"
        />
      </div> 
      <div className="w-full bg-gray-100 h-2.5 mb-4">
        <div className="bg-pink-600 h-2.5" style={{ width }}></div>
      </div> 
    </div>
  )
}
