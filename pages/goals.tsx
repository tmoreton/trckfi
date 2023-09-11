"use client"
import { useState, useEffect } from 'react'
import { TrashIcon, BanknotesIcon, PlusIcon } from '@heroicons/react/20/solid'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import { useSession } from "next-auth/react"
import Menu from '../components/menu'
import Meta from '../components/meta'
import Notification from '../components/notification'
import { PinkBtn } from '../components/pink-btn'
import { classNames } from '../lib/lodash'
import { useRouter } from 'next/router'
import GoalModal from '../components/modals/goal-modal'
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image'

const defaultGoal = {
  name: null,
  date: null,
  current_amount: null,
  amount: null,
  image: ''
}

const Goals = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [showGoal, setShowGoal] = useState(false)
  const [goal, setGoal] = useState(defaultGoal)
  const cld = new Cloudinary({cloud: {cloudName: 'dd2svpjuq'}})

  // cld.image returns a CloudinaryImage with the configuration set.
  const myImage = cld.image('uw-file3');

  const handleChange = (e) => {
    const { name, value } = e.target
    setGoal({ ...goal, [name]: value })
  }

  const addGoal = async (e) => {
    e.preventDefault()
    console.log(goal)
    // const res = await fetch(`/api/add_goal`, {
    //   body: JSON.stringify({
    //     user,
    //     goal
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    // })
    // const { error } = await res.json()
    // showError(error)
    // if(!error) router.reload()
  }

  const remove = async () => {
    setShowGoal(false)
    setGoal(defaultGoal)
  }

  return (
    <>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <Meta
          title="Goals"
          description=""
          image=''
          keywords=''
        />
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 pb-12">
          <div className="col-span-1 p-4 shadow-sm sm:p-6 sm:px-8 rounded-md border border-gray-200">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <form onSubmit={addGoal}>
                <div className="relative z-0 w-full mb-8 group inline-flex border-b pb-4">
                  <div className="text-3xl text-gray-900 font-bold w-screen">
                    <AdvancedImage cldImg={myImage} />
                    <img
                      src={goal.image}
                      className="rounded-lg object-cover"
                    />
                    <CldUploadWidget
                      uploadPreset="g2m9wg7k"
                      onUpload={(result, widget) => {
                        console.log(result.info)
                        setGoal({ ...goal, image: result.info?.url })
                        widget.close()
                      }}
                    >
                      {({ open }) => {
                        function handleOnClick(e) {
                          e.preventDefault();
                          open();
                        }
                        return (
                          <PinkBtn type="button" onClick={handleOnClick}>
                            Upload an Image
                          </PinkBtn>
                        );
                      }}
                    </CldUploadWidget>
                    <div className="py-1">
                      <p>My goal is to save for: </p>
                      <input 
                        type="text" 
                        name="name"
                        id="name"
                        placeholder='Spain 2024! 🇪🇸'
                        className="appearance-none focus:outline-none pt-2" 
                        required
                        value={goal?.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center py-1">
                      <p>I am starting with $</p>
                      <input 
                        type="number" 
                        name="current_amount" 
                        id="current_amount" 
                        className="appearance-none focus:outline-none pl-1 w-28"  
                        required
                        placeholder='500'
                        value={goal?.current_amount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center py-1">
                      <p>and want to save $</p>
                      <input 
                        type="number" 
                        name="amount" 
                        id="amount"
                        className="appearance-none focus:outline-none pl-1 w-28"  
                        required
                        placeholder='3500'
                        value={goal?.amount}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center py-1">
                      <p>by </p>
                      <input 
                        type="date" 
                        name="date" 
                        id="date"
                        className={classNames(
                          goal?.date
                            ? 'text-gray-900'
                            : 'text-gray-400',
                          'appearance-none focus:outline-none pl-2 w-[225px]'
                        )}
                        required
                        value={goal?.date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:flex sm:flex-row-reverse justify-between">
                  <div className="sm:flex sm:flex-row-reverse items-center">
                    <PinkBtn type="submit" onClick={() => console.log('adding')}>
                      <p className="text-lg">Update Goal</p>
                    </PinkBtn>
                  </div>
                  <button type="button" onClick={remove}>
                    <TrashIcon onClick={remove} className="h-8 w-8 text-red-400 hover:text-red-300" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-span-1 p-4 shadow-sm sm:p-6 sm:px-8 rounded-md border border-gray-200">
            <button
              type="button"
              className=" h-full relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <BanknotesIcon className="mx-auto h-20 w-20 text-gray-500" aria-hidden="true" />
              <div className="flex justify-center items-center mt-3">
                <PlusIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
                <span className="block text-2xl font-normal text-gray-500">Add New Goal</span>
              </div>
            </button>
          </div>
        </div>
        {/* <GoalModal user={user} showError={showError} showGoal={showGoal} setShowGoal={setShowGoal}/>
        <PinkBtn type="button" onClick={() => setShowGoal(true)}>
          Add Goal
        </PinkBtn> */}
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Goals), { ssr: false })