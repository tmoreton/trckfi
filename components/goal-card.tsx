import { CldUploadWidget } from 'next-cloudinary';
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/20/solid'
import { classNames } from '../lib/lodash'
import { PinkBtn } from '../components/pink-btn'
import { useState } from 'react'
import { Cloudinary } from "@cloudinary/url-gen";
import { DateTime } from "luxon"

export default function ({ user, defaultGoal, remove, getGoals, showError }) {
  const [goal, setGoal] = useState(defaultGoal)
  const [edited, setEdited] = useState(false)
   // @ts-ignore
  const cld = new Cloudinary({cloud: {cloudName: 'dd2svpjuq', secure: true }, secure: true})
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFilename(event.target.files[0].name);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset','YOUR_UPLOAD_PRESET_NAME');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dd2svpjuq/image/upload`, {
        body: formData,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        },
        method: 'POST',
      })
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i))
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData()
    body.append("file", image)
    console.log(body)
    const response = await fetch(`https://api.cloudinary.com/v1_1/dd2svpjuq/image/upload`, {
      method: "POST",
      body
    });
  };

  const handleChange = (e) => {
    setEdited(true)
    const { name, value } = e.target
    setGoal({ ...goal, [name]: value })
  }

  const addGoal = async (e) => {
    e.preventDefault()
    if(!goal.image){
      showError('Missing Image')
    } else {
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
      const { error } = await res.json()
      if(!error) getGoals()
    }
  }

  const snippet = () => {
    let { date, amount, current_amount } = goal
    let goal_amount = amount - current_amount
    if(date && amount && current_amount){
      let difference = DateTime.fromISO(goal.date).diff(DateTime.now(), ['months']).toObject()
      let months = Math.round(difference.months)
      return `You will need to save $${Math.round(goal_amount/months)} over the next ${months} months to hit your goal 🎉`
    }
	}

  return (
    <>
      <form onSubmit={handleSubmit}>
      <div>
        <input type="file" onChange={handleFileChange} />
        <label>{filename}</label>
      </div>
      <button type="submit">Upload</button>
    </form>
      
      <form onSubmit={addGoal}>
        <div className="col-span-1 p-4 shadow-sm sm:p-6 sm:px-8 rounded-md border border-gray-200">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <div className="relative z-0 w-full mb-8 group inline-flex border-b pb-4">
              <div className="text-xl text-gray-900 font-normal w-screen">
              <input type="file" name="myImage" onChange={uploadToClient} />
          <button
            className="btn btn-primary"
            type="submit"
            onClick={uploadToServer}
          >
            Send to server
          </button>
                <CldUploadWidget
                  uploadPreset="g2m9wg7k"
                  onUpload={(result, widget) => {
                    // @ts-ignore
                    setGoal({ ...goal, image: result.info?.secure_url })
                    widget.close()
                  }}
                >
                  {({ open }) => {
                    function handleOnClick(e) {
                      e.preventDefault();
                      open();
                    }
                    return (
                      <>
                        { goal.image ?
                          <img
                            onClick={handleOnClick}
                            src={goal.image}
                            className="rounded-lg object-cover"
                          />
                          :
                          <button
                            onClick={handleOnClick}
                            type="button"
                            className="hover:text-gray-400 h-25 relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" />
                            <div className="flex justify-center items-center mt-3">
                              <span className="block text-xl font-semibold text-gray-500">Upload Image</span>
                            </div>
                          </button>
                        }
                      </>
                    );
                  }}
                </CldUploadWidget>
                <div className="py-1 pt-5">
                  <p>My goal is to save for: </p>
                  <input 
                    type="text" 
                    name="name"
                    id="name"
                    placeholder='Spain 2024! 🇪🇸'
                    className="appearance-none focus:outline-none pt-2 font-bold" 
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
                    className="appearance-none focus:outline-none pl-1 w-28 font-bold"  
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
                    className="appearance-none focus:outline-none pl-1 w-28 font-bold"  
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
                      'appearance-none focus:outline-none pl-2 w-[160px] font-bold'
                    )}
                    required
                    value={DateTime.fromISO(goal?.date).toFormat('yyyy-MM-dd')}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            { goal.date && goal.amount && 
            <div className="flex items-center pb-10">
              <p className="text-xl text-gray-900 font-semibold">{snippet()}</p>
            </div>}
            <div className="sm:flex sm:flex-row-reverse justify-between">
              <div className="sm:flex sm:flex-row-reverse items-center">
                { edited && <PinkBtn type="submit" onClick={() => console.log('adding')}>
                  <p className="text-md">Update Goal</p>
                </PinkBtn>}
              </div>
              <button type="button" onClick={remove}>
                <TrashIcon className="h-6 w-6 text-red-400 hover:text-red-300" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}