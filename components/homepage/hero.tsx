import { useState } from 'react'
import Link from 'next/link'
import VideoModal from '../modals/video-modal'
import Image from 'next/image'

const features = [
  {
    name: 'Save Time',
    description: 'Streamline personal finances - for an easy overview of net worth, cash flow, investments, recurring charges, transactions, and more in one secure hub.',
    icon: '⏰',
  },
  {
    name: 'Manifest Your Financial Goals',
    description: 'Visualize your money goals with our vision board to stay motivated to take control of your finances, embracing positive money habits',
    icon: '🚀',
  },
  {
    name: 'Data Security + No Advertisement',
    description: 'Your financial data is secure: no sharing, no selling. No stored logins, read-only access. Only YOU control fund movements. No to ads that disrupt your experience',
    icon: '🔒',
  },
  {
    name: 'Spend Less + Earn Rewards',
    description: 'Stay informed with alerts on recurring charges and upcoming payments to save money! Earn rewards by referring a friend or engaging with our daily bite-sized financial Q&A.',
    icon: '💸',
  },
]


export default function () {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden bg-white py-12 sm:py-22">
      <VideoModal setOpen={setOpen} open={open} />      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4">
            <div className="lg:max-w-lg">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0">
              <div>
                <h1 className="mx-auto max-w-5xl font-display text-7xl sm:text-8xl font-bold tracking-tighter text-slate-900 leading-tight">
                  Budgets {' '}
                  <span className="hidden sm:block relative whitespace-nowrap text-pink-600">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 418 42"
                      className="absolute left-0 top-2/3 h-[0.58em] w-full fill-pink-300/70"
                      preserveAspectRatio="none"
                    >
                      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                    </svg>
                    <span className="relative">
                      f**king suck
                    </span>
                  </span>{' '}
                  <span className="block sm:hidden text-pink-600">f**king suck</span>
                </h1>
                <p className="mt-8 mb-2 text-3xl font-bold text-gray-900 tracking-wide">
                  But it's still important to track where your money is going!
                </p>
                <button onClick={() => setOpen(true)} className="py-2.5 text-lg font-semibold text-pink-600 hidden lg:block">
                  Watch how Trckfi works
                </button>
                <a target="_blank" href="https://www.youtube.com/watch?v=BChUkULTuCs" className="py-2.5 text-lg font-semibold text-pink-600 block lg:hidden">
                  Watch how Trckfi works
                </a>
                <div className="mb-8 flex items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-2xl font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Get Started Today <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="sm:w-[60rem] w-full">
            <div className="block lg:absolute relative z-[50] mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
              <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                <img src="/assets/transactions-mobile.png" className="w-[272px] h-[572px]" alt="" />
              </div>
            </div>

            <div className="hidden lg:block relative overflow-hidden -mt-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] lg:border-[20px] rounded-t-xl h-[650px] max-w-[900px]">
                  <div className="rounded-lg overflow-hidden h-[600px] bg-white">
                    <img src="/assets/transactions.png" className="h-[600px] w-full rounded-xl" alt="dashboard" />
                  </div>
                </div>
                <div className="hidden lg:block relative mx-auto bg-gray-900 rounded-b-xl rounded-t-sm h-[40px] max-w-[1100px]">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[200px] h-[15px] bg-gray-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white pt-10 pb-16">
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold leading-7 text-pink-600 my-6">Take control of your personal finances and wave goodbye to financial stress</h2>
            <p className="text-xl font-base tracking-tight text-gray-900">
            More than just tracking – Trckfi simplifies finances, prioritizing mindset and education for stress-free money management
            </p>
          </div>
          <div className="mx-auto mt-6 sm:mt-20 lg:mt-12 lg:mx-12 mx-0">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-12">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center">
                      <div className="text-3xl" aria-hidden="true">{feature.icon}</div>
                    </div>
                    <div className="font-bold">{feature.name}</div>
                  </dt>
                  <dd className="mt-2 text-lg leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div> 

      <div className="lg:my-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto text-center">
            <h2 className="text-3xl font-bold leading-7 text-pink-600 my-6">Transform Your Relationship with Money</h2>
            <p className="mt-6 text-xl leading-8 text-gray-900">
              Manage all your personal finances securely in one place <b>(net worth, recurring charges, money goals, transactions, spending and categories)</b>. 
              Experience less stress, more motivation, and a better relationship with money. Visualize goals, reshape your money mindset, and boost financial literacy.
            </p>
            {/* <p className="mt-2 font-semibold tracking-tight text-gray-900 text-3xl">Earn as you learn!</p> */}
          </div>
        </div>
        <div className="relative overflow-hidden pt-8">
          <div className="block lg:hidden relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
              <img src="/assets/dashboard-mobile.png" className="w-[272px] h-[572px]" alt="" />
            </div>
          </div>

          <div className="hidden lg:block mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] lg:border-[20px] rounded-t-xl h-[250px] lg:h-[550px] max-w-[900px]">
              <div className="rounded-lg overflow-hidden h-[200px] lg:h-[500px] bg-white">
                <img src="/assets/dashboard.png" className="h-[250px] lg:h-[650px] w-full rounded-xl" alt="dashboard" />
              </div>
            </div>
            <div className="hidden lg:block relative mx-auto bg-gray-900 rounded-b-xl rounded-t-sm h-[40px] max-w-[1100px]">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[200px] h-[15px] bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}