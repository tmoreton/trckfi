import { useState } from 'react'
import Link from 'next/link'
import VideoModal from '../modals/video-modal'
import { LockClosedIcon, NoSymbolIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/solid'
import { classNames } from '../../lib/lodash'

const testimonials = [
  [
    [
      {
        body: 'I love that we can manually verify each transaction that has happened on any of our accounts. It really changed our spending habits. We also love the vision board and emphasis on money mindset. Using the app is part of my daily routine now and gives me the confidence to make better financial decisions. Highly recommended!',
        author: {
          name: 'Christina',
        },
      },
    ],
    [
      {
        body: "I've tried many finance apps, but Trckfi takes the crown. No more Excel headaches! This app effortlessly simplifies money tracking, net worth, transactions, cash-flow, etc. Kudos for the easy-to-understand design.",
        author: {
          name: 'Sophia',
        },
      },
    ],
  ],
  [
    [
      {
        body: "Trckfi has simplified my finances. I hate budgeting, but tracking expenses and cash flow is important to me! This platform makes so easy. I love the Q&A feature, I'm learning a lot about managing money and I get rewards. Highly recommended!",
        author: {
          name: 'Sam',
        },
      },
    ],
    [
      {
        body: "Finally, an easy-to-use finance app! I love everything about Trckfi and regret not setting up this money tracking app sooner. Financial planning is so easy, checking my accounts is a snap, and I get email alerts. I highly recommend this personal finance app",
        author: {
          name: 'Jake',
        },
      },
    ],
  ],
]

const features = [
  {
    name: 'Save Time',
    description: 'Streamline personal finances - know net worth, cash flow, investments, recurring charges, transactions, monthly income, and more in one financial secure hub.',
    icon: '⏰',
  },
  {
    name: 'Manifest Your Financial Goals',
    description: 'Visualize your money goals with our vision board to stay motivated to take control of your financial health, embracing positive money habits and financial planning.',
    icon: '🚀',
  },
  {
    name: 'Spend Less + Earn Rewards',
    description: 'Track your expenses and upcoming bills. Save money! Boost your financial literacy with our daily bite-sized financial Q&A. Refer a friend for extra rewards!',
    icon: '🔒',
  },
  {
    name: 'Data Security + No Ads ',
    description: 'Your financial data is secure: no sharing, no selling. No stored logins, read-only access. Only YOU control fund movements.',
    icon: '💸',
  },
]


export default function () {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden bg-white py-12 sm:py-24">
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
                  But it's still important to track where you're spending your money!
                </p>
                <button onClick={() => setOpen(true)} className="py-2.5 text-lg font-semibold text-pink-600 hidden lg:block">
                  Watch how Trckfi works
                </button>
                <a target="_blank" href="https://www.youtube.com/watch?v=BChUkULTuCs" className="py-2.5 text-lg font-semibold text-pink-600 block lg:hidden">
                  Watch how Trckfi works
                </a>
                <div className="mb-8 flex items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-2xl font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
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
                <img src="/assets/transactions-mobile.png" className="w-[272px] h-[572px]" alt="Trckfi - Your Personal Finance App and Expense Tracker" />
              </div>
            </div>

            <div className="hidden lg:block relative overflow-hidden -mt-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[20px] rounded-xl h-[650px] max-w-[900px]">
                  <div className="rounded-lg overflow-hidden h-[600px] bg-white">
                    <img src="/assets/transactions.png" className="h-[600px] w-full rounded-xl" alt="Your Personal Finances - Effective Spending Tracker" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white pt-10 pb-16">
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold leading-7 text-pink-600 my-6">Struggling to manage your money?</h2>
            <p className="text-xl font-base tracking-tight text-gray-900">
            Then this is for you. Easily track your money and reduce stress with our financial vision boards to empower confident decisions.
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

      <div className="overflow-hidden bg-white py-12 lg:py-24">
        <div className="mx-auto max-w-8xl px-6 lg:px-8">
          <div className="mx-auto text-center">
            <h4 className="text-base font-semibold leading-7 text-gray-900">Dashboard</h4>

            <p className="text-3xl font-bold leading-7 text-pink-600 mb-6">New money dashboard gives a clear view of your earnings</p>
            <p className="mt-6 text-xl leading-8 text-gray-900">
            Achieve financial clarity through our all-in-one money dashboard. Capture monthly snapshots of income, expenses, and savings effortlessly. 
            <br/>
            <span className="hidden lg:block">Monitor account balances, net worth, and monthly spending by categories. Simplify money management, maintain a clear cash flow, and discover easy opportunities to save.</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative overflow-hidden pt-8 lg:grid lg:grid-cols-3">
          <div className="hidden lg:block mx-auto max-w-7xl lg:col-span-2">
            <img src="/assets/dashboard-no-menu.png" className="w-full rounded-xl" alt="Feel confident with your money management" />
          </div>

          <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
              <img src="/assets/dashboard-mobile.png" className="w-[272px] h-[572px]" alt="Feel confident with your money management" />
            </div>
          </div>
        </div>
        <div className="block lg:hidden mb-8 flex items-center justify-center gap-x-6">
          <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
            Signup <span aria-hidden="true">→</span>
          </Link>
          {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
            Learn More
          </Link> */}
        </div>
      </div>

      <div className="overflow-hidden bg-white py-12 lg:py-24 hidden lg:block">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="lg:pr-8 lg:pt-4 flex items-center">
              <div className="lg:max-w-lg">
                <h4 className="text-base font-semibold leading-7 text-gray-900">Visionboard</h4>
                <p className="mt-2 text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">Visualize your money goals with Trckfi’s vision board</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Visualize your financial goals and reshape your money mindset to stay motivated and in the path to achieving them.
                </p>
                <div className="mb-8 flex items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Signup <span aria-hidden="true">→</span>
                  </Link>
                  {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Learn More
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="hidden lg:block mx-auto max-w-7xl">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <img src="/assets/visionboard.png" className=" w-full rounded-2xl" alt="Reach your financial goals faster with our money management app" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="overflow-hidden bg-white py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="col-span-2 hidden lg:block">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <img src="/assets/goals.png" className=" w-full rounded-2xl" alt="Unlock the power of visualizing your money goals" />
              </div>
            </div>
            <div className="lg:pr-8 lg:pt-4 flex items-center">
              <div className="lg:max-w-lg">
                <h4 className="text-base font-semibold leading-7 text-gray-900">Goals</h4>
                <p className="mt-2 text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">Effortlessly monitor your financial goals</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Connect your accounts for seamless tracking, helping you progress toward what matters most and enabling strategic planning for success.
                </p>
                <div className="hidden lg:flex mb-8 items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Signup <span aria-hidden="true">→</span>
                  </Link>
                  {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Learn More
                  </Link> */}
                </div>
              </div>
            </div>

            <div className="block lg:hidden relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
              <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                <img src="/assets/goals-mobile.png" className="w-[272px] h-[572px]" alt="Unlock the power of visualizing your money goals" />
              </div>
            </div>
          </div>
          <div className="block lg:hidden mb-8 flex items-center justify-center gap-x-6">
            <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Signup <span aria-hidden="true">→</span>
            </Link>
            {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Learn More
            </Link> */}
          </div>
        </div>
      </div>

    
      <div className="overflow-hidden bg-white py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="lg:pr-8 lg:pt-4 flex items-center col-span-2">
              <div className="lg:max-w-2xl">
                <h4 className="text-base font-semibold leading-7 text-gray-900">Sync Banks</h4>
                <p className="mt-2 text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">Sync all of your bank accounts and assets in one place</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                Effortlessly all your bank accounts, credit cards, retirement accounts, loans, and investments to Trckfi for seamless balance and net worth tracking. Your data is secured with bank-level protection, ensuring constant privacy.
                </p>
                <div className="hidden lg:flex mb-8 items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Signup <span aria-hidden="true">→</span>
                  </Link>
                  {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Learn More
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="mx-auto max-w-7xl">
                <img src="/assets/banks.png" className=" w-full rounded-2xl" alt="Sync all of your bank accounts and assets in one place and track transactions" />
              </div>
            </div>
          </div>
          <div className="block lg:hidden mb-8 flex items-center justify-center gap-x-6">
            <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Signup <span aria-hidden="true">→</span>
            </Link>
            {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Learn More
            </Link> */}
          </div>
        </div>
      </div>


      <div className="overflow-hidden bg-white py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="col-span-2 hidden lg:block">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <img src="/assets/networth.png" className=" w-full rounded-2xl" alt="Streamline Your Cash flow" />
              </div>
            </div>
            <div className="lg:pr-8 lg:pt-4 flex items-center">
              <div className="lg:max-w-lg">
                <h4 className="text-base font-semibold leading-7 text-gray-900">Net Worth</h4>
                <p className="mt-2 text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">Your portfolio and finances together</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                Investments are a huge part of your financial life, and Trckfi’s investment tracker can help you stay on top of yours. Instantly see your asset allocation across all your investment accounts like 401(k), mutual funds, brokerage accounts, and even IRAs. 
                </p>
                <div className="hidden lg:flex mb-8 items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Signup <span aria-hidden="true">→</span>
                  </Link>
                  {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Learn More
                  </Link> */}
                </div>
              </div>
            </div>

            <div className="block lg:hidden relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
              <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                <img src="/assets/networth-mobile.png" className="w-[272px] h-[572px]" alt="Streamline Your Cash flow" />
              </div>
            </div>
          </div>
          <div className="block lg:hidden mb-8 flex items-center justify-center gap-x-6">
            <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Signup <span aria-hidden="true">→</span>
            </Link>
            {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Learn More
            </Link> */}
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="lg:pr-8 lg:pt-4 flex items-center col-span-1">
              <div className="lg:max-w-2xl">
                <h4 className="text-base font-semibold leading-7 text-gray-900">Transactions</h4>

                <p className="mt-2 text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">Simplify Your Cash flow: All Your Transactions in One Hub</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Effortlessly manage your finances with our transaction-centric platform. Consolidate every income and expense in one easy-to-navigate feed. 
                </p>
                <div className="hidden lg:flex mb-8 items-center gap-x-6">
                  <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Signup <span aria-hidden="true">→</span>
                  </Link>
                  {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Learn More
                  </Link> */}
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="sm:w-[60rem] w-full">
                <div className="block lg:absolute relative z-[50] mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
                  <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    <img src="/assets/transactions-mobile.png" className="w-[272px] h-[572px]" alt="Trckfi - Your Personal Finance App and Expense Tracker" />
                  </div>
                </div>

                <div className="hidden lg:block relative overflow-hidden">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[20px] rounded-xl h-[650px] max-w-[900px]">
                      <div className="rounded-lg overflow-hidden h-[600px] bg-white">
                        <img src="/assets/transactions.png" className="h-[600px] w-full rounded-xl" alt="Your Personal Finances - Effective Spending Tracker" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block lg:hidden mb-8 flex items-center justify-center gap-x-6">
                <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Signup <span aria-hidden="true">→</span>
                </Link>
                {/* <Link href="#" className="mt-5 rounded-3xl bg-white px-5 py-2.5 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Learn More
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white">
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto mt-6 sm:mt-20 lg:mt-12 lg:mx-12 mx-0">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-5 lg:gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative text-center">
                <LockClosedIcon className='text-pink-600 h-9 w-9 mx-auto' aria-hidden="true" />
                <dt className="text-xl font-semibold leading-7 text-pink-600">
                  <div className="font-bold">Security you can trust</div>
                </dt>
                <dd className="hidden lg:block mt-2 text-lg leading-7 text-gray-600">Trckfi ensures the safety and privacy of your data with bank-level security. We never store your login details, and account access is limited to read-only – your funds are secure. We can’t touch them!</dd>
              </div>
              <div className="relative text-center">
                <NoSymbolIcon className='text-pink-600 h-9 w-9 mx-auto' aria-hidden="true" />
                <dt className="text-xl font-semibold leading-7 text-pink-600">
                  <div className="font-bold">Prioritize Your Finances, Not Ads</div>
                </dt>
                <dd className="hidden lg:block mt-2 text-lg leading-7 text-gray-600">At Trckfi, our commitment is to enhance your financial well-being with a streamlined experience. Enjoy an ad-free interface, and rest assured, we never sell or share your financial data to third parties. </dd>
              </div>
              <div className="relative text-center">
                <UserGroupIcon className='text-pink-600 h-9 w-9 mx-auto' aria-hidden="true" />
                <dt className="text-xl font-semibold leading-7 text-pink-600">
                  <div className="font-bold">Collaborate with your partner securely</div>
                </dt>
                <dd className="hidden lg:block mt-2 text-lg leading-7 text-gray-600">Invite a partner or financial advisor to collaborate at no extra cost. They'll get their own login, and you'll both get a shared view of what's happening with your money.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-pink-600">Testimonials</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Helping people reach their financial goals!
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
            {testimonials.map((columnGroup, columnGroupIdx) => (
              <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
                {columnGroup.map((column, columnIdx) => (
                  <div
                    key={columnIdx}
                    className={classNames(
                      (columnGroupIdx === 0 && columnIdx === 0) ||
                        (columnGroupIdx === testimonials.length - 1 && columnIdx === columnGroup.length - 1)
                        ? 'xl:row-span-2'
                        : 'xl:row-start-1',
                      'space-y-8'
                    )}
                  >
                    {column.map((testimonial) => (
                      <figure
                        key={testimonial.author.handle}
                        className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                      >
                        <blockquote className="text-gray-900">
                          <p>{`“${testimonial.body}”`}</p>
                        </blockquote>
                        <div className="mt-2 flex items-center gap-x-2">
                          <StarIcon className='text-yellow-400 h-5 w-5 flex-shrink-0' aria-hidden="true" />
                          <StarIcon className='text-yellow-400 h-5 w-5 flex-shrink-0' aria-hidden="true" />
                          <StarIcon className='text-yellow-400 h-5 w-5 flex-shrink-0' aria-hidden="true" />
                          <StarIcon className='text-yellow-400 h-5 w-5 flex-shrink-0' aria-hidden="true" />
                          <StarIcon className='text-yellow-400 h-5 w-5 flex-shrink-0' aria-hidden="true" />
                        </div>
                        <figcaption className="mt-2 flex items-center gap-x-4">
                          <div className="font-semibold">{testimonial.author.name}</div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign Up Today */}
      <div className="overflow-hidden bg-white px-4 pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <h4 className="text-3xl font-bold tracking-tight text-pink-600 sm:text-4xl">
            Sign up for Trckfi today!
          </h4>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 ">
            Start reaching your financial goals with powerful tools, personalized insights, and much more.
          </p>
          <div className="mb-8 flex items-center justify-center gap-x-6">
            <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-2xl font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Get Started <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}