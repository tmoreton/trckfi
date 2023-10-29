import Image from 'next/image'

export default function () {

  const subscribe = async (e) => {
    e.preventDefault()
    
  }
  
  return (
    <div className="bg-white">
      <div className="relative isolate pt-14">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
        </svg>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <Image
              src='/trckfi-logo-beta.png'
              alt='Trckfi'
              width={150}
              height={100}
            />
            <p className="mt-6 text-xl leading-8 text-gray-600">
            All done! I’ve sent the Business Coaching Bundle straight to your inbox. While you’re here, please could take 5 seconds of your time to help me out - which of these topics are you interested in? Please select as many or as few as you like - this really helps me understand who my audience is, and helps me figure out the best videos to make :)
            </p>
            <ul role="list" className="mt-6 space-y-3 text-lg leading-6 text-gray-600">
              <li className="flex items-center gap-x-3">
                <input
                  id="comments"
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  className="h-6 w-6 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                />
                Test
              </li>
              <li className="flex items-center gap-x-3">
                <input
                  id="comments"
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  className="h-6 w-6 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                />
                Test
              </li>
              <li className="flex items-center gap-x-3">
                <input
                  id="comments"
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  className="h-6 w-6 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                />
                Test
              </li>
              <li className="flex items-center gap-x-3">
                <input
                  id="comments"
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  className="h-6 w-6 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                />
                Test
              </li>
            </ul>
            <button
              onClick={() => console.log('answer')}
              type="button"
              className="mt-7 rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

