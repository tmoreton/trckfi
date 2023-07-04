

export default function () {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center">
              Your Financial Data, <br/> For Your Eyes Only
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Full control to use, download and delete your data when you want.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/getting-started" className="text-sm font-semibold leading-6 text-gray-900">
                <button className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Get Started
                </button>
              </a>
              {/* <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
