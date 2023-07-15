import { useState } from 'react'
import DashboardLayout from '../components/dashboard-layout'
import { Switch } from '@headlessui/react'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import RemoveAccount from "../components/remove-account"
import PlaidLink from "../components/plaid-link"
import CancelModal from '../components/cancel-modal'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ({ showError, user, linked_user, accounts }) {
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)
  const [openCancelModal, setCancelOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [removedAccounts, setRemovedAccounts] = useState([])
  const router = useRouter()

  const send = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/send_link_token`, {
      body: JSON.stringify({
        user_id: user.id,
        from_email: user.email,
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

  const removeToken = async (access_token) => {
    const res = await fetch(`/api/remove_access_token`, {
      body: JSON.stringify({
        access_token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) router.reload()
  }

  return (
    <DashboardLayout>
      <CancelModal showError={showError} open={openCancelModal} setOpen={setCancelOpen} signOut={signOut} user={user}/>
      <RemoveAccount setRemovedAccounts={setRemovedAccounts} removeToken={removeToken} removedAccounts={removedAccounts} />
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-pink-600">Profile</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            This information will be displayed publicly so be careful what you share.
          </p>
          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Subscription</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">Monthly - Active</div>
                <button onClick={() => setCancelOpen(true)} type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                  Cancel Subscription
                </button>
              </dd>
            </div>

            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Name</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user.name}</div>
                {/* <button type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                  Update
                </button> */}
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Email address</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{user.email}</div>
              </dd>
            </div>

            {
              linked_user ?
              <div className="pt-6 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Linked Account</dt>
                <form onSubmit={remove} method="POST" className="flex justify-between gap-x-6 sm:flex-auto">
                  <div className="text-gray-900">{linked_user.email}</div>                 
                  <button onClick={remove} type="button" className="flex font-semibold text-red-600 hover:text-red-500 justify-end">
                    Remove
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
          <h2 className="text-base font-semibold leading-7 text-pink-600">Bank accounts</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">Connect bank accounts to your account.</p>
          <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {
              Object.keys(accounts).map(key => {
                return (
                  <div key={key} className="flex justify-between gap-x-6 py-6">
                    <li>
                     <p className="text-lg font-bold text-gray-900 py-1">{key}</p>
                      { accounts[key].map(a => <div className="text-xs font-medium text-gray-900 pt-1">{a.name} - <span className="font-light">{a.official_name}</span></div>) }
                    </li>
                    <button onClick={() => setRemovedAccounts(accounts[key])} type="button" className="font-semibold text-red-600 hover:text-red-500">
                      Remove
                    </button>
                  </div>
                )
              })
            }
          </ul>

          <div className="flex border-t border-gray-100 pt-6">
            { (Object.keys(accounts)?.length < 5) ? <PlaidLink user={user} showError={showError} /> : <p className="text-sm leading-6 text-gray-500">Please remove account link to add more...</p>}
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-pink-600">Emails and Communications</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Choose what language and currency format to use throughout your account.
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <Switch.Group as="div" className="flex pt-6">
              <Switch.Label as="dt" className="w-64 flex-none pr-6 font-medium text-gray-900" passive>
                Weekly Emails
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
                Monthly Emails
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
                Alerts
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

export async function getServerSideProps(context) {
  const session= await getSession(context)
  const user = session?.user

  if(!user) return {
    redirect: {
      destination: '/',
      permanent: false,
    }
  }

  // @ts-ignore
  const { linked_user_id, id, email } = user

  if(!email) return {
    redirect: {
      destination: '/',
      permanent: false,
    }
  }
  let linked_user = null
  if(linked_user_id){
    linked_user = await prisma.user.findUnique({
      where: { id: linked_user_id }
    })
  }
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
  const a = await prisma.accounts.findMany({
    where: {
      OR: query,
      active: true,
    },
    select: {
      name: true,
      bank_name: true,
      official_name: true,
      access_token: true
    },
  })

  const accounts = a.reduce(function (r, a) {
    r[a.bank_name] = r[a.bank_name] || [];
    r[a.bank_name].push(a);
    return r;
  }, Object.create(null))
  
  return { props: { user, linked_user, accounts } }
}