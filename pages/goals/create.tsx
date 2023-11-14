import { useSession } from "next-auth/react"
import { useState } from 'react'
import ProgressNav from '../../components/progress-nav'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import  { useLocalStorage } from '../../utils/useLocalStorage'

const defaultGoal = {
  name: null,
  date: null,
  current_amount: null,
  amount: null,
  image: null,
  user_id: null
}

export default function () {
  const { data: session } = useSession()
  const user = session?.user
  const [goal, setGoal] = useLocalStorage('goal', defaultGoal)

  const handleFileChange = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('upload_preset','g2m9wg7k');
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dd2svpjuq/image/upload`, {
        body: formData,
        method: 'POST',
      })
      let data = await res.json()
      setGoal({ ...goal, image: data?.secure_url })
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <>
      <ProgressNav width={0} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
              Let's Create Your Goal!
            </h1>
            <p className="mb-10 mt-5 text-xl lg:text-2xl text-gray-600">
              First let's visualize our goal with a photo for inspiration
            </p>
            { goal.image ?
              <img src={goal.image} className="w-1/2 rounded-lg object-cover mx-auto"/>
              :
              <button type="button" className="mx-auto w-1/2 cursor-pointer hover:text-gray-400 h-25 relative block rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <input type="file" name="photo" className="cursor-pointer opacity-0 absolute w-full h-full top-0 left-0" onChange={handleFileChange}/>
                <ArrowUpTrayIcon className="cursor-pointer mx-auto h-10 w-10 text-gray-500" aria-hidden="true" />
                <div className="cursor-pointer flex justify-center items-center mt-3">
                  <span className="block text-xl font-semibold text-gray-500">Upload Image</span>
                </div>
              </button>
            }
            <Link href="/goal/details">
              <button className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                Next
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}