import Image from 'next/image'

const features = [
  {
    name: 'Save Time',
    description: 'Effortlessly Manage Your Finances – Visualize All Your Transactions in One Place.',
    icon: '⏰',
  },
  {
    name: 'Feel Empowered',
    description: 'Take Control of Your Financial Goals and Connect with Your Money.',
    icon: '🚀',
  },
  {
    name: 'Earn More',
    description: 'Get Rewards When You Refer a Friend, and Use Them to Offset Your Subscription Costs.',
    icon: '💰',
  },
  {
    name: 'Spend Less',
    description: 'Stay Informed with Alerts on Recurring Charges and Save Money.',
    icon: '💸',
  },
]

export default function () {
  return (
    <>
      <div className="bg-white pt-10 pb-16">
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center">
            <h2 className="text-3xl font-bold leading-7 text-pink-600 my-6">What is Trckfi?</h2>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              Trckfi is your online all-in-one, user-friendly personal finance platform.
            </p>
          </div>
          <div className="mx-auto mt-6 sm:mt-20 lg:mt-12 lg:mx-12 mx-0">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center">
                      <div className="text-3xl" aria-hidden="true">{feature.icon}</div>
                    </div>
                    <div className="font-bold">{feature.name}</div>
                  </dt>
                  <dd className="mt-2 text-xl leading-7 text-gray-600">{feature.description}</dd>
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
                <h2 className="text-3xl font-bold leading-7 text-pink-600 my-6">Why Trckfi?</h2>
                <p className="mt-2 font-semibold tracking-tight text-gray-900 text-2xl">Unlimited Bank Connections, Smart Automation, and Total Control of Your Finances.</p>
                <dl className="mt-10 max-w-xl space-y-8 text-xl leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">✏️</div>
                      Earn as You Learn
                    </dt>{' '}
                    <dd className="inline">Elevate Financial Literacy and Earn Subscription Credits by Answering Daily Questions.</dd>
                  </div>
                </dl>
                <dl className="mt-10 max-w-xl space-y-8 text-xl leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">🔒</div>
                      Secure & Private
                    </dt>{' '}
                    <dd className="inline">Your Financial Data Stays Secure and Private – No Sharing, No Selling, Just Confidence in Your Privacy.</dd>
                  </div>
                </dl>
                <dl className="mt-10 max-w-xl space-y-8 text-xl leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">📷</div>
                      Comprehensive Snapshot
                    </dt>{' '}
                    <dd className="inline">Get a Comprehensive Snapshot of All Your Accounts in One Dashboard, Including Banks, Loans, Stocks, and Cryptocurrency – Stay Informed with Ease.</dd>
                  </div>
                </dl>
                <dl className="mt-10 max-w-xl space-y-8 text-xl leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-12">
                    <dt className="inline font-semibold text-gray-900">
                      <div className="absolute left-1 top-1 text-3xl text-pink-600" aria-hidden="true">🎯</div>
                      Vision Board Magic
                    </dt>{' '}
                    <dd className="inline">Discover Your Financial Goals and Unlock Opportunities to Achieve Them by Making Smarter Money Choices Daily with Trckfi's Vision Board.</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/assets/net-worth-accounts.png"
                alt="Trckfi Finance Dashboard"
                className="lg:w-[75rem] max-w-5xl rounded-xl shadow-xl ring-1 ring-gray-400/10 w-full"
                width={1500}
                height={500}
                unoptimized={true}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}