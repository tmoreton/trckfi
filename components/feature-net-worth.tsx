import { ArrowPathIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/20/solid'
import { Emoji } from 'emoji-picker-react'
import Image from 'next/image'

const features = [
  {
    name: 'Live Price Updates',
    description: 'Keep up to date with real-time bank, retirement, stock & crypto prices',
    icon: ArrowPathIcon,
  },
  {
    name: 'Est Home Value',
    description: 'Our home is one of our biggest investments, we can track its value with the overall net worth',
    icon: HomeIcon,
  },
  {
    name: 'Custom accounts',
    description: 'Create any type of asset/liability you want to track along with the ability to create virtual cards/accounts for more detailed categorization',
    icon: CreditCardIcon,
  },
]

export default function () {
  return (
    <>
      <div className="mt-32 mb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center justify-between">
            <h2 className="text-base font-semibold leading-7 text-pink-600">Track your progress</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex justify-center"><div className="mr-3 mt-1"><Emoji unified={'1f4c8'} size={30} /></div> Wealth Tracker</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Watch as you hit your money goals month-by-month and tracking your progress with live bank, stock market & crypto price updates
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              src="/assets/networth-feature.png"
              alt="Net worth tracker"
              className="mb-[-10%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              width={2432}
              height={1442}
            />
            <div className="relative" aria-hidden="true">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon className="absolute left-1 top-1 h-5 w-5 text-pink-600" aria-hidden="true" />
                  {feature.name}
                </dt>{' '}
                <dd>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}