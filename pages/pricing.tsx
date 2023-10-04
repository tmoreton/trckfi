import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Container from '../components/container'
import Layout from '../components/layout'
import Menu from '../components/menu'
import getStripe from '../utils/get-stripejs'
import { useRouter } from 'next/router'
import EmailModal from '../components/modals/email-modal'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]

const tiers = [
  {
    name: 'Early Adopter',
    id: 'beta',
    save: '',
    price: {
      monthly: { 
        id: process.env.NEXT_PUBLIC_STRIPE_BETA_MONTHLY_PRICE_ID, 
        price: '$0'
      },
    },
    description: 'Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.',
    features: [
      'All features of pro and family plans with unlimited connections',
    ],
  },
  {
    name: 'Pro',
    id: 'pro',
    save: '$18',
    price: {
      monthly: { 
        id: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID, 
        price: '$8.99'
      }, 
      annually: { 
        id: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID, 
        price: '$89.99'
      },
    },
    description: 'Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.',
    features: [
      '5 Bank Connections (Credit Cards, Savings, Checking, Retirement, etc.)',
      'Unlimited Crypto, Stock, and Home Accounts',
      'Manage Recurring Expenses',
      'Monthly Spend Tracking',
      'Net Worth Analysis',
      'Custom Categories: Create Your Own Spending Categories and Groups',
      'Categorization Rules: Define Custom Rules for Tricky Transactions',
      'Flexible Asset Entry: Easily Include Assets Beyond Digital (e.g., Art, Foreign Bank Accounts, etc.)',
      'Vision Board for Visualizing and Manifesting Financial Goals',
      'Goal Setting Tab: Plan and Track Your Financial Goals',
      'Weekly & Monthly Email Recaps',
      'Daily Questions/Answers to Earn Money and Boost Your Financial Literacy',
    ],
  },
  {
    name: 'Family',
    id: 'family',
    save: '$29',
    price: {
      monthly: { 
        id: process.env.NEXT_PUBLIC_STRIPE_FAMILY_MONTHLY_PRICE_ID, 
        price: '$11.99'
      }, 
      annually: { 
        id: process.env.NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID, 
        price: '$114.99'
      },
    },
    description: 'Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.',
    features: [
      'Unlimited Bank Connections (Credit Cards, Savings, Checking, Retirement, etc.)',
      'Unlimited Crypto, Stock, and Home Accounts',
      'Manage Recurring Expenses',
      'Monthly Spend Tracking',
      'Net Worth Analysis',
      'Custom Categories: Create Your Own Spending Categories and Groups',
      'Categorization Rules: Define Custom Rules for Tricky Transactions',
      'Flexible Asset Entry: Easily Include Assets Beyond Digital (e.g., Art, Foreign Bank Accounts, etc.)',
      'Vision Board for Visualizing and Manifesting Financial Goals',
      'Goal Setting Tab: Plan and Track Your Financial Goals',
      'Weekly & Monthly Email Recaps',
      'Daily Questions/Answers to Earn Money and Boost Your Financial Literacy',
      'Link Another User to Collaborate on Your Finances',
    ],
  },
]

export default function Pricing ({ showError }) {
  const router = useRouter()
  const { referral_id, beta_user } = router.query
  const [frequency, setFrequency] = useState(frequencies[0])
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    setFrequency(frequencies[0])
    if(beta_user){
      setProducts(tiers)
    } else {
      setProducts(tiers.filter((item) => item.id !== 'beta' ))
    }
  }, [])

  const checkout = async (price_id) => {
    const res = await fetch(`/api/checkout_session`, {
      body: JSON.stringify({ 
        price_id,
        referral_id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const data = await res.json()
    showError(data.error)
    if (data.error) return

    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      sessionId: data.id,
    })
    showError(error)
  }

  return (
    <Layout>
      <Menu showError={showError}/>
      <EmailModal open={open} setOpen={setOpen} showError={showError}/>
      <Container>
        <div className="bg-white">
          <main className="isolate">
            <div className="isolate overflow-hidden bg-pink-600 rounded-2xl">
              <div className="mx-auto max-w-7xl px-6 pb-96 pt-24 text-center lg:px-8">
                <div className="mx-auto max-w-4xl">
                  <h2 className="text-base font-semibold leading-7 text-white">Pricing</h2>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4 text-white">
                    { referral_id ? 
                      <span className="pb-10">Your friend gave you $10! 🎉<br/></span>
                      :
                      <span className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        The right price for you, <br className="hidden sm:inline lg:hidden" />
                        whoever you are
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
                  <div className="flex justify-center mb-10">
                    <RadioGroup
                      value={frequency}
                      onChange={setFrequency}
                      className="grid grid-cols-2 gap-x-1 rounded-full bg-white p-1 text-center text-xs font-semibold leading-5"
                    >
                      <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
                      {frequencies.map((option) => (
                        <RadioGroup.Option
                          key={option.value}
                          value={option}
                          className={({ checked }) =>
                            classNames(checked ? 'bg-pink-600 text-white' : 'text-pink-600 bg-white', 'cursor-pointer rounded-full px-2.5 py-1')
                          }
                        >
                          <span>{option.label}</span>
                        </RadioGroup.Option>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className={classNames(beta_user ? "lg:grid-cols-3" : "lg:grid-cols-2", "mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl")}>
                      {products.map((tier) => (
                        <div
                          key={tier.id}
                          className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                        >
                          <div>
                            <h3 id={tier.id} className="text-base font-semibold leading-7 text-pink-600">
                              {tier.name}
                            </h3>
                            {
                              tier.price[frequency.value]?.price &&
                              <>
                                <div className="mt-4 flex items-baseline gap-x-2">
                                  <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]?.price}</span>                              
                                  <span className="text-base font-normal leading-7 text-gray-600">{frequency.priceSuffix}</span>
                                </div>
                                { frequency.value === 'annually' && tier.id !== 'beta' && <span className="text-base italic font-semibold text-green-600 ml-2">Save {tier.save}!</span>}
                              </>
                            }

                            {/* <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p> */}
                            <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                              {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                  <CheckIcon className="h-6 w-5 flex-none text-pink-600" aria-hidden="true" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {
                            tier.id === 'beta' ?
                            <button
                              onClick={() => checkout(tier.price[frequency.value]?.id)}
                              aria-describedby={tier.id}
                              className="mt-8 block rounded-md bg-pink-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                            >
                              Get started today
                            </button>
                            :
                            <button
                              onClick={() => setOpen(true)}
                              className="border-2 border-pink-500 mt-8 block rounded-md bg-white px-3.5 py-2 text-center text-sm font-semibold leading-6 text-pink-600 shadow-sm hover:text-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                            >
                              Get Early Access
                            </button>
                          }
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