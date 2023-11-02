import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/20/solid'
import { classNames } from '../lib/lodash'
import { PinkBtn } from '../components/pink-btn'
import { useState } from 'react'
import { DateTime } from "luxon"
import { useRouter } from 'next/router'
import { commaShort } from '../lib/lodash'

export default function ({ user, defaultGoal, remove, getGoals, showError }) {
  const [goal, setGoal] = useState(defaultGoal)
  const [edited, setEdited] = useState(false)
  const router = useRouter()

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

  const handleChange = (e) => {
    setEdited(true)
    const { name, value } = e.target
    setGoal({ ...goal, [name]: value })
  }

  const addGoal = async (e) => {
    e.preventDefault()
    setEdited(false)
    const res = await fetch(`/api/add_goal`, {
      body: JSON.stringify({
        goal,
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    // const { error } = await res.json()
    // if(!error) router.reload()
  }

  const snippet = () => {
    let { date, amount, current_amount } = goal
    let goal_amount = amount - current_amount
    if(date && amount && current_amount){
      let difference = DateTime.fromISO(goal.date).diff(DateTime.now(), ['months']).toObject()
      let months = Math.round(difference.months)
      return `You will need to save ${commaShort(goal_amount/difference.months)} over the next ${months} months to hit your goal 🎉`
    }
	}

  return (
    <form onSubmit={addGoal}>
      <div className="col-span-1 p-4 shadow-sm sm:p-6 sm:px-8 rounded-md border border-gray-200 h-full">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <div className="relative z-0 w-full mb-4 group inline-flex pb-4">
            <div className="text-xl text-gray-900 font-normal w-screen">
              { goal.image &&
                <img src={goal.image} className="rounded-lg object-cover w-full h-[225px]"/>
              }
              { !goal.image && !goal.id &&
                <button
                  type="button"
                  className="cursor-pointer hover:text-gray-400 h-25 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <input type="file" name="photo" className="cursor-pointer opacity-0 absolute w-full h-full top-0 left-0" onChange={handleFileChange}/>
                  <ArrowUpTrayIcon className="cursor-pointer mx-auto h-10 w-10 text-gray-500" aria-hidden="true" />
                  <div className="cursor-pointer flex justify-center items-center mt-3">
                    <span className="block text-xl font-semibold text-gray-500">Upload Image</span>
                  </div>
                </button>
              }
              <div className="py-1 pt-5 font-bold">
                <p>My goal is to save for: </p>
                <input 
                  type="text" 
                  name="name"
                  id="name"
                  placeholder=''
                  className="appearance-none focus:outline-none pt-2 font-normal border-b" 
                  required
                  value={goal?.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center py-1 font-bold">
                <p>I am starting with $</p>
                <input 
                  type="number" 
                  name="current_amount" 
                  id="current_amount" 
                  className="appearance-none focus:outline-none pl-1 w-28 font-normal border-b"  
                  required
                  placeholder=''
                  value={goal?.current_amount}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center py-1 font-bold">
                <p>and want to save $</p>
                <input 
                  type="number" 
                  name="amount" 
                  id="amount"
                  className="appearance-none focus:outline-none pl-1 w-28 font-normal border-b"  
                  required
                  placeholder=''
                  value={goal?.amount}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center py-1 font-bold">
                <p>by </p>
                <input 
                  type="date" 
                  name="date" 
                  id="date"
                  className={classNames(
                    goal?.date
                      ? 'text-gray-900'
                      : 'text-gray-400',
                    'appearance-none focus:outline-none pl-2 w-[160px] font-normal border-b'
                  )}
                  required
                  value={goal?.date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          { goal.date && goal.amount && 
          <div className="flex items-center pb-4">
            <p className="text-xl text-gray-900 font-semibold">{snippet()}</p>
          </div>}
          <div className="sm:flex sm:flex-row-reverse justify-between">
            <div className="sm:flex sm:flex-row-reverse items-center">
              <PinkBtn type="submit" onClick={() => console.log("")}>
                <p className="text-md">Save Goal</p>
              </PinkBtn>
            </div>
            <button type="button" onClick={() => remove(goal.id)}>
              <TrashIcon className="h-6 w-6 text-red-400 hover:text-red-300" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}