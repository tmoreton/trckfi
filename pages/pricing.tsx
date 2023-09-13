import { useState, useEffect } from 'react'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import Container from '../components/container'
import Layout from '../components/layout'
import Menu from '../components/menu'
import getStripe from '../utils/get-stripejs'
import { useRouter } from 'next/router'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]

const tiers = [
  {
    name: 'Pro',
    id: 'pro',
    // Demo
    price: {
      monthly: 
        { 
          id: 'price_1Ng62nBJfatAKl0YqqSyRFtJ', 
          price: '$8.99'
        }, 
      annually: { 
        id: 'price_1Ng62nBJfatAKl0YlQLX8Ict', 
        price: '$89.99'
      },
    },
    // price: {
    //   monthly: 
    //     { 
    //       id: 'price_1NgTvcBJfatAKl0YAb4DRv9E', 
    //       price: '$8.99'
    //     }, 
    //   annually: { 
    //     id: 'price_1NgTvdBJfatAKl0YD0UfX0aF', 
    //     price: '$89.99'
    //   },
    // },
    description: 'Modi dolorem expedita deleniti. Corporis iste qui inventore pariatur adipisci vitae.',
    features: ['5 products', 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
  },
  {
    name: 'Family',
    id: 'family',
    // Demo
    price: {
      monthly: 
        { 
          id: 'price_1NhBpCBJfatAKl0Yi1diZDWe', 
          price: '$11.99'
        }, 
      annually: { 
        id: 'price_1NhBpCBJfatAKl0YCO6Lmef8', 
        price: '$114.99'
      },
    },
    // price: {
    //   monthly: 
    //     { 
    //       id: 'price_1NhCLaBJfatAKl0YT7Ur6IXu', 
    //       price: '$11.99'
    //     }, 
    //   annually: { 
    //     id: 'price_1NhCLaBJfatAKl0YmKWh1dR3', 
    //     price: '$114.99'
    //   },
    // },
    description: 'Explicabo quo fugit vel facere ullam corrupti non dolores. Expedita eius sit sequi.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      '1-hour, dedicated support response time',
      'Marketing automations',
    ],
  },
]

export default function Pricing ({ showError }) {
  const router = useRouter()
  const { referral_id } = router.query
  const [frequency, setFrequency] = useState(frequencies[0])
  
  useEffect(() => {
    setFrequency(frequencies[0])
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
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos odit doloribus
                    molestiae voluptatum.
                  </p>
                  {/* <svg
                    viewBox="0 0 1208 1024"
                    className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
                  >
                    <ellipse cx={604} cy={512} fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" rx={604} ry={512} />
                    <defs>
                      <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0">
                        <stop stopColor="#fff" />
                        <stop offset={1} stopColor="#fff" />
                      </radialGradient>
                    </defs>
                  </svg> */}
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
                    <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
                      {tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                        >
                          <div>
                            <h3 id={tier.id} className="text-base font-semibold leading-7 text-pink-600">
                              {tier.name}
                            </h3>
                            <div className="mt-4 flex items-baseline gap-x-2">
                              <span className="text-5xl font-bold tracking-tight text-gray-900">{tier.price[frequency.value]?.price}</span>                              
                              <span className="text-base font-semibold leading-7 text-gray-600">{frequency.priceSuffix}</span>
                            </div>
                            <p className="mt-6 text-base leading-7 text-gray-600">{tier.description}</p>
                            <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
                              {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                  <CheckIcon className="h-6 w-5 flex-none text-pink-600" aria-hidden="true" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => checkout(tier.price[frequency.value]?.id)}
                            aria-describedby={tier.id}
                            className="mt-8 block rounded-md bg-pink-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                          >
                            Get started today
                          </button>
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