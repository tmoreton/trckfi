import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Container from '../components/container'
import Layout from '../components/layout'
import MainMenu from '../components/menu-main'
import { useRouter } from 'next/router'
import EmailModal from '../components/modals/email-modal'
import Link from 'next/link'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const tiers = [
  {
    name: 'Monthly',
    id: 'monthly',
    price: {
      id: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID, 
      price: '$8.99'
    },
    description: 'Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.',
    features: [
      '<b>30 Day Free Trial - Cancel Anytime</b>',
      '<b>Unlimited connections</b> (financial relationship with a specific bank: credit cards, savings/checking, retirement, loans, mortgage, etc.)',
      'Add crypto and individual stocks and get automated daily price updates',
      'Earn rewards by answering daily financial literacy questions and cut your subscription costs',
      'Net Worth Analysis',
      'Spending insights & transactions lists',
      'Unlimited custom rules & categories for tricky transactions',
      'Find recurring expenses before they get charged',
      'Visualize and track your financial dreams with the Vision Board and Goal Setting Tab',
      'Manual entry: home value, and non-digital assets (e.g., art, foreign bank accounts, etc.)',
      'Weekly & monthly spending recaps',
      '<b>Link collaborators to view your finances</b>',
    ],
  },
  {
    name: 'Yearly',
    id: 'yearly',
    price: {
      id: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID, 
      price: '$6.25'
    },
    description: 'Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.',
    features: [
      '<b>30 Day Free Trial - Cancel Anytime</b>',
      '<b>Unlimited connections</b> (financial relationship with a specific bank: credit cards, savings/checking, retirement, loans, mortgage, etc.)',
      'Add crypto and individual stocks and get automated daily price updates',
      'Earn rewards by answering daily financial literacy questions and cut your subscription costs',
      'Net Worth Analysis',
      'Spending insights & transactions lists',
      'Unlimited custom rules & categories for tricky transactions',
      'Find recurring expenses before they get charged',
      'Visualize and track your financial dreams with the Vision Board and Goal Setting Tab',
      'Manual entry: home value, and non-digital assets (e.g., art, foreign bank accounts, etc.)',
      'Weekly & monthly spending recaps',
      '<b>Link collaborators to view your finances</b>',
    ],
  },
]

export default function Pricing ({ showError }) {
  const router = useRouter()
  const { referral_id } = router.query
  const [open, setOpen] = useState(false)

  return (
    <Layout>
      <MainMenu showError={showError}/>
      <EmailModal open={open} setOpen={setOpen} showError={showError}/>
      <Container>
        <div className="bg-white">
          <main className="isolate">
            <div className="isolate overflow-hidden bg-pink-600 rounded-2xl">
              <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center lg:px-8">
                <div className="mx-auto max-w-4xl">
                  <h2 className="text-base font-semibold leading-7 text-white">Trckfi Pricing</h2>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4 text-white">
                    { referral_id ? 
                      <span className="pb-10">Your friend gave you $10! 🎉<br/></span>
                      :
                      <span className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Your Money's Best Friend, No Exceptions!
                      </span>
                    }
                  </h1>
                </div>
                <div className="relative mt-6">
                  <p className="mx-auto max-w-2xl text-lg leading-8 text-white">
                   Trckfi is your online all-in-one, user-friendly personal finance platform. <br/> Unlimited Bank Connections, Smart Automation, and Total Control of Your Finances.
                  </p>
                </div>
              </div>
              <div className="flow-root bg-white pb-10">
                <div className="-mt-80">
                  <div className="mx-auto sm:px-0 lg:px-8 max-w-5xl">
                    <div className={classNames("lg:grid-cols-2 mx-auto grid grid-cols-1 gap-8")}>
                      {tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                        >
                          <div>
                            <h3 id={tier.id} className="text-base font-semibold leading-7 text-pink-600">
                              {tier.name}
                            </h3>
                            {
                              tier.price.price &&
                              <>
                                <div className="mt-4 flex items-baseline gap-x-2">
                                  { tier.id === 'yearly' ?
                                  <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.price.price}</span>
                                  :                              
                                  <span className="text-5xl font-bold tracking-tight text-gray-900 lg:pb-6">{tier.price.price}</span>
                                  }
                                  <span className="text-base font-normal leading-7 text-gray-600">/month</span>
                                </div>
                                { tier.id === 'yearly' && <><span className="text-sm italic font-normal text-black">Billed annually at $74.99/year</span><span className="text-base italic font-semibold text-green-600 ml-2">Save $33!</span></>}
                              </>
                            }
                            <Link href={`/intro/create-account?price_id=${tier.price.id}&referral_id=${referral_id}`}>
                              <button className="mt-4 w-full block rounded-md bg-pink-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                                Get started today
                              </button>
                            </Link>
                            <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                              {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                  <CheckIcon className="h-6 w-5 flex-none text-pink-600" aria-hidden="true" />
                                  <p dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Container>
    </Layout>
  )
}