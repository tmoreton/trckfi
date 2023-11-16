import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from '../components/dashboard-layout'
import { Switch } from '@headlessui/react'
import { signOut, useSession } from "next-auth/react"
import Menu from '../components/menu'
import Rules from '../components/rules'
import { useRouter } from 'next/router'
import  { clearLocalStorage } from '../utils/useLocalStorage'
import ConfettiExplosion from 'react-confetti-explosion'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Profile = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  // @ts-ignore
  let { email_weekly, email_monthly, email_alert } = user
  const [preferences, setPreferences] = useState({email_weekly, email_monthly, email_alert})
  const [answers, setAnswers] = useState({
    correct: 0,
    total: 0
  })
  const [referrals, setReferrals] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [sendBtn, setSendBtn] = useState('Send Invite')
  const [email, setEmail] = useState('')
  const [linkedUser, setLinkedUser] = useState({})
  const [link, setLink] = useState('')
  const router = useRouter()

  useEffect(() => {
    // @ts-ignore
    getSettings()
  }, [])

  const getSettings = async () => {
    const res = await fetch(`/api/get_settings`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    if(!error) {
      setReferrals(data?.referrals)
      setAnswers(data?.answers)
      setLinkedUser(data?.linked_user)
    }
  }

  const updatePreferences = async (key, value) => {
    let updated = preferences
    updated[key] = value
    setPreferences({ ...preferences, [key]: value})
    const res = await fetch(`/api/update_user`, {
      body: JSON.stringify({
        user, preferences: updated
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  const send = async (e) => {
    e.preventDefault()
    setSendBtn('Email Sent! 🎉')
    const res = await fetch(`/api/send_link_token`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user?.id,
        from_email: user?.email,
        to_email: email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  const remove = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/remove_link`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) signOut()
  }

  const redirect = async () => {
    // @ts-ignore
    if(!user?.customer_id){
      showError('Subscription can only be updated by the primary user')
    } else {
      const res = await fetch(`/api/create_bill_portal`, {
        body: JSON.stringify({
          // @ts-ignore
          customer_id: user.customer_id
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const { error, data } = await res.json()
      showError(error)
      if(!error) router.replace(data)
    }
  }

  const redeem = async () => {
    const res = await fetch(`/api/add_balance`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user.id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) {
      setShowSuccess(true)
      getSettings()
    }
  }

  const copyLink = () => {
    // @ts-ignore
    let url = `${process.env['NEXT_PUBLIC_BASE_URL']}/pricing?referral_id=${user?.referral_id}`
    setLink(url)
    navigator.clipboard.writeText(url)
  }

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <div className="bg-pink-100 rounded-2xl">
          <div className="mx-auto max-w-7xl px-6 py-5 sm:py-10 lg:flex lg:items-center lg:justify-between lg:px-8 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
                Give $10, Get $10
              </h2>
              <p className="text-lg font-normal pt-2">Give a friend a <b>$10</b> credit and get a <b>$10</b> credit when they signup!</p>
            </div>
            <div className="mt-10 items-center text-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
              <button
                
                onClick={copyLink}
                className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                {link ? 'Copied! 🎉' : 'Copy Referral Link'}
              </button>
              { // @ts-ignore
                !user.customer_id && <p className="text-xs text-gray-500 pt-3">Any credits will get added to the account owner</p>
              }
            </div>
          </div>
        </div>

        <div className="relative isolate overflow-hidden pb-4 md:pb-16 pt-5">
          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-2 lg:px-2 xl:px-0">
              {/* <div className="flex items-center flex-wrap justify-center text-center gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                <dt className="text-md font-medium leading-6 text-gray-600">Saved</dt>
                <dd className="w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-700">
                  $0
                </dd>
                <dd className="text-sm font-normal text-gray-700">
                  since joining Trckfi
                </dd>
              </div> */}
              <div className="flex items-center flex-wrap justify-center text-center gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                <div>
                  <dt className="text-md font-medium leading-6 text-gray-600">Questions</dt>
                  <dd className="w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-700">
                    {answers?.correct} 
                    <span className="ml-2 text-sm font-normal">of {answers?.total} 
                      <span className="mx-2 font-bold">≈</span> 
                      <span className="text-md font-bold">${Number(answers?.correct*.1).toFixed(2)}</span>
                    </span>
                  </dd>
                  <p className="w-full text-gray-700 text-sm font-normal mt-2 mb-1 italic">{`$${referrals && referrals.find(a => a.type === 'points')?._sum?.amount || 0 } redeemed`}</p>
                </div>
                <button onClick={redeem} type="button" className="font-normal text-pink-600 hover:text-pink-500 text-xs w-full">
                  Redeem Points
                </button>
                {showSuccess && <ConfettiExplosion />}
              </div>
              <div className="sm:border-l lg:border-l flex items-center flex-wrap justify-center text-center gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                <dt className="text-md font-medium leading-6 text-gray-600">Earned</dt>
                <dd className="w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-700">
                  {`$${referrals && referrals.find(a => a.type === 'referral')?._sum?.amount || 0 }`}
                </dd>
                <dd className="text-sm font-normal text-gray-700">
                  from referrals
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base font-semibold leading-7 text-pink-600">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              General account information
            </p>
            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Subscription</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">Active</div>
                  {/* @ts-ignore */}
                  { user?.customer_id && <button onClick={redirect} type="button" className="font-semibold text-red-600 hover:text-red-500">
                    Manage Subscription
                  </button>}
                </dd>
              </div>
              
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">{user?.email}</div>
                </dd>
              </div>

                {/* user.product_id === 'prod_OUAgEdZI2gYrgv' && */}
                <>
                  {
                    linkedUser ?
                    <div className="pt-6 sm:flex items-center">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Linked Account</dt>
                      <form onSubmit={remove} method="POST" className="flex justify-between gap-x-6 sm:flex-auto">
                        <div className="text-gray-900">
                          {
                            // @ts-ignore
                            linkedUser?.email
                          }
                        </div>                 
                        <button onClick={remove} type="button" className="flex font-semibold text-red-600 hover:text-red-500 justify-end">
                          Unlink
                        </button>
                      </form>
                    </div>
                    :
                    <div className="pt-6 sm:flex items-center">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Invite User</dt>
                      <form onSubmit={send} method="POST" className="flex justify-between gap-x-6 sm:flex-auto">
                        <input 
                          type="email" 
                          name="email" 
                          id="email"
                          placeholder="Email"
                          className="w-1/2 text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />                     
                        <button onClick={send} type="button" className="w-30 font-semibold text-pink-600 hover:text-pink-500">
                          {sendBtn}
                        </button>
                      </form>
                    </div>
                  }
                </>
            </dl>
          </div>

          <div>
            <h2 className="text-base font-semibold leading-7 text-pink-600">Emails and Communications</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Choose what emails to receive on a weekly & monthly basis
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label as="dt" className="w-64 flex-none pr-6 font-medium text-gray-900" passive>
                  Weekly Emails
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={preferences.email_weekly}
                    onChange={e => updatePreferences('email_weekly', e)}
                    className={classNames(
                      preferences.email_weekly ? 'bg-pink-600' : 'bg-gray-200',
                      'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        preferences.email_weekly ? 'translate-x-3.5' : 'translate-x-0',
                        'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>

              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label as="dt" className="w-64 flex-none pr-6 font-medium text-gray-900" passive>
                  Monthly Emails
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={preferences.email_monthly}
                    onChange={e => updatePreferences('email_monthly', e)}
                    className={classNames(
                      preferences.email_monthly ? 'bg-pink-600' : 'bg-gray-200',
                      'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        preferences.email_monthly ? 'translate-x-3.5' : 'translate-x-0',
                        'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>

              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label as="dt" className="w-64 flex-none pr-6 font-medium text-gray-900" passive>
                  Alerts & Reminders
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={preferences.email_alert}
                    onChange={e => updatePreferences('email_alert', e)}
                    className={classNames(
                      preferences.email_alert ? 'bg-pink-600' : 'bg-gray-200',
                      'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        preferences.email_alert ? 'translate-x-3.5' : 'translate-x-0',
                        'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>

            </dl>
          </div>
        </div>
        <Rules showError={showError}/>
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false })