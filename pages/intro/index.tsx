import { useRouter } from 'next/router'
import ProgressNav from '../../components/progress-nav'

const items = [
  { text: 'Keep track of my transactions' },
  { text: 'Track and grow my net worth to financial independence' },
  { text: 'Learn more about finance and improve my overall financal knowledge' },
  { text: 'Help pay off my debt' },
  { text: 'Feel motivated to reach my goal of buying/investing' }
]

export default function () {
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault()
    // Save data from checkboxes
    router.push({
      pathname: '/intro/setup-account',
    })
  }
  
  return (
    <>
      <ProgressNav width={'40%'} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
              Welcome to Trckfi! 🎉
            </h1>
            <p className="mt-6 pb-2 text-xl lg:text-3xl text-gray-600">
              We want to be there along your side on your path to financial success! 
            </p>
            <p className="mb-10 text-xl lg:text-3xl text-gray-600">
              How can Trckfi help you along the way?
            </p>
            <form onSubmit={onSubmit}>
              <ul role="list" className="my-10 space-y-8 text-xl leading-6 text-gray-600">
                {items.map((i, id) => (
                  <li key={id} className="gap-x-3">
                    <div className="rounded-lg bg-gray-100 ring-1 ring-gray-900/10 flex items-center p-4">
                      <label className="select-none container block relative cursor-pointer text-sm lg:text-xl pl-10">{i.text}
                        <input name={JSON.stringify(id)} className="absolute opacity-0 left-0 top-0 cursor-pointer rounded-2xl" type="checkbox" />
                        <span className="h-7 w-7 rounded-2xl checkmark absolute top-0 left-0 bg-gray-400"></span>
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="submit"
                className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Setup Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}