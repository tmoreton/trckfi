import Link from 'next/link'

export default function () {
  return (
    <div className="relative overflow-hidden isolate bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0">
          <div className="mt-16 sm:mt-32 lg:mt-16">
            {/* <h1 className="mt-10 text-4xl font-bold text-gray-900 sm:text-6xl">
              Take CONTROL <br/>of Your WEALTH <br/> your DATA your eyes ONLY. 
            </h1> */}
            <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
              Your finances{' '}
              <span className="relative whitespace-nowrap text-pink-600">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-pink-300/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative">made simple</span>
              </span>{' '}
              with automation
            </h1>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Take control of your wealth and keep your data, for your eyes only.
            </p>
            <div className="mt-8 flex items-center gap-x-6">
              <Link href='/pricing' className="text-md font-semibold leading-6 text-gray-900">
                <button className="rounded-3xl bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Get Started
                </button>
              </Link>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Watch how Trckfi works <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-28 hidden md:block">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="/assets/dashboard-beta-full.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
        <div className="mt-10 md:hidden">
          <div className="rounded-md shadow-2xl ring-1 ring-gray-900/10">
            <img
              src="/assets/dashboard-beta-full.png"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="rounded-md"
            />
          </div>
        </div>
      </div>

    </div>
  )
}