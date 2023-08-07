import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import Head from 'next/head'
import DashboardLayout from '../components/dashboard-layout'
import { Switch } from '@headlessui/react'
import { signOut, useSession } from "next-auth/react"
import CancelModal from '../components/modals/cancel-modal'
import  { useLocalStorage } from '../utils/useLocalStorage'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Settings = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)
  const [openCancelModal, setCancelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [linkedUser, setLinkedUser] = useState({})
  const [accounts, setAccounts] = useLocalStorage('settings_accounts', {})

  useEffect(() => {
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
    setLoading(false)
    if(error){
      showError(error)
    } else {
      setLinkedUser(data?.linked_user)
      setAccounts(data?.accounts)
    }
  }

  // const unhideAccount = async (account) => {
  //   const res = await fetch(`/api/unhide_account`, {
  //     body: JSON.stringify({
  //       user, account
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST',
  //   })
  //   const { error } = await res.json()
  //   showError(error)
  //   if(!error) getSettings()
  // }

  const send = async (e) => {
    e.preventDefault()
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
    if(!error) setEmail('Email Sent! 🎉')
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

  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Settings</title>
      </Head>
      <CancelModal showError={showError} open={openCancelModal} setOpen={setCancelOpen} signOut={signOut} user={user}/>
      
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
                <div className="text-gray-900">Monthly - Active</div>
                <button onClick={() => setCancelOpen(true)} type="button" className="font-semibold text-red-600 hover:text-red-500">
                  Cancel Subscription
                </button>
              </dd>
            </div>

            {/* <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Name</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user?.name}</div>
                <button type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                  Update
                </button>
              </dd>
            </div> */}

            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user?.email}</div>
              </dd>
            </div>

            {
              linkedUser ?
              <div className="pt-6 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Linked Account</dt>
                <form onSubmit={remove} method="POST" className="flex justify-between gap-x-6 sm:flex-auto">
                  <div className="text-gray-900">{linkedUser?.email}</div>                 
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
                  <button onClick={send} type="button" className="w-20 font-semibold text-pink-600 hover:text-pink-500">
                    Send Invite
                  </button>
                </form>
              </div>
            }
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
                Receive Weekly Emails
              </Switch.Label>
              <dd className="flex flex-auto items-center justify-end">
                <Switch
                  checked={automaticTimezoneEnabled}
                  onChange={setAutomaticTimezoneEnabled}
                  className={classNames(
                    automaticTimezoneEnabled ? 'bg-pink-600' : 'bg-gray-200',
                    'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      automaticTimezoneEnabled ? 'translate-x-3.5' : 'translate-x-0',
                      'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </dd>
            </Switch.Group>

            <Switch.Group as="div" className="flex pt-6">
              <Switch.Label as="dt" className="w-64 flex-none pr-6 font-medium text-gray-900" passive>
                Receive Monthly Emails
              </Switch.Label>
              <dd className="flex flex-auto items-center justify-end">
                <Switch
                  checked={automaticTimezoneEnabled}
                  onChange={setAutomaticTimezoneEnabled}
                  className={classNames(
                    automaticTimezoneEnabled ? 'bg-pink-600' : 'bg-gray-200',
                    'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      automaticTimezoneEnabled ? 'translate-x-3.5' : 'translate-x-0',
                      'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </dd>
            </Switch.Group>

            <Switch.Group as="div" className="flex pt-6">
              <Switch.Label as="dt" className="w-64 flex-none pr-6 font-medium text-gray-900" passive>
                Receive Reminders
              </Switch.Label>
              <dd className="flex flex-auto items-center justify-end">
                <Switch
                  checked={automaticTimezoneEnabled}
                  onChange={setAutomaticTimezoneEnabled}
                  className={classNames(
                    automaticTimezoneEnabled ? 'bg-pink-600' : 'bg-gray-200',
                    'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      automaticTimezoneEnabled ? 'translate-x-3.5' : 'translate-x-0',
                      'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </dd>
            </Switch.Group>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default dynamic(() => Promise.resolve(Settings), { ssr: false })