import { ArrowPathIcon, HomeIcon, CreditCardIcon } from '@heroicons/react/20/solid'
import { Emoji } from 'emoji-picker-react'

const features = [
  {
    name: 'SAVE TIME',
    description: 'Streamline Your Finances Effortlessly – Visualize Everything in One Place.',
    icon: '⏰',
  },
  {
    name: 'FEEL EMPOWERED',
    description: 'Have a place to visualize your financial goals, and connect with yourself',
    icon: '🚀',
  },
  {
    name: 'EARN MORE',
    description: 'Refer a friend and get money back towards your subscription',
    icon: '💰',
  },
  {
    name: 'SPEND LESS',
    description: 'Save with alerts on recurring charges',
    icon: '💸',
  },
]

export default function () {
  return (
    <>
      <div className="bg-white pt-10 pb-16">
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-pink-600">What is Trckfi?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your online all-in-one user friendly financial hub
            </p>
          </div>
          <div className="mx-auto mt-6 sm:mt-20 lg:mt-12 lg:mx-12 mx-0">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-lg font-semibold leading-7 text-gray-900">
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
      <div className="overflow-hidden bg-white py-12 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:ml-auto lg:pl-4 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-pink-600">Why Trckfi?</h2>
                <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Unlimited Bank Connections. Smart Automation. Secure. You're in Control.</p>
                {/* <p className="mt-6 text-xl font-semibold tracking-tight leading-8 text-gray-600">
                  Unlimited Bank Connections. Smart Automation. Secure. You're in Control.
                </p> */}
                <dl className="mt-10 max-w-xl space-y-8 text-lg leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">✏️</div>
                      Earn as You Learn
                    </dt>{' '}
                    <dd className="inline">Elevate Financial Literacy. Get credits towards your subscription through daily question answers.</dd>
                  </div>
                </dl>
                <dl className="mt-10 max-w-xl space-y-8 text-lg leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">🔒</div>
                      Secure & Private
                    </dt>{' '}
                    <dd className="inline">Your financial data stays yours. No sharing, no selling – just confidence in your privacy.</dd>
                  </div>
                </dl>
                <dl className="mt-10 max-w-xl space-y-8 text-lg leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">📷</div>
                      Comprehensive Snapshot
                    </dt>{' '}
                    <dd className="inline">All your accounts in one dashboard. Banks, loans, stocks, crypto – stay informed with ease.</dd>
                  </div>
                </dl>
                <dl className="mt-10 max-w-xl space-y-8 text-lg leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">🎯</div>
                      Vision Board Magic
                    </dt>{' '}
                    <dd className="inline">Discover your financial goals and unlock opportunities to achieving them by making better money choices daily.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="/assets/dashboard-beta-full.jpg"
                alt="Trckfi Finance Dashboard"
                className="lg:w-[75rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[65rem] w-full"
                width={2432}
                height={1442}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}