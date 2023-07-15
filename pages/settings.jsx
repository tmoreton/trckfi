import { useState } from 'react'
import Menu from '../components/menu'
import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'
import { Switch } from '@headlessui/react'
import {
  BellIcon,
  CreditCardIcon,
  CubeIcon,
  FingerPrintIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import RemoveAccount from "../components/remove-account"

const secondaryNavigation = [
  { name: 'General', href: '#', icon: UserCircleIcon, current: true },
  { name: 'Security', href: '#', icon: FingerPrintIcon, current: false },
  { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  { name: 'Plan', href: '#', icon: CubeIcon, current: false },
  { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Team members', href: '#', icon: UsersIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ({ showError, user, linked_user, accounts }) {
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true)
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)
  const [accessToken, setAccessToken] = useState(null)
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
        all: false
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

  const removeModal = async (accounts, key) => {
    // const items = accounts[key].filter(item => item.access_token.indexOf(accounts[key].access_token) !== -1)
    // setAccessToken(accounts[key].access_token)
    // setRemovedAccounts(accounts)
    // setOpen(true)
  }

  return (
    <Layout>
      <Head>
        <title>Trckfi - Settings</title>
      </Head>
      <Container>
        <RemoveAccount open={open} setOpen={setOpen} removeToken={removeToken} accounts={removedAccounts} />
        <Menu showError={showError}/>
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Settings</h1> 
        </div>
        <div className="mx-auto lg:flex lg:gap-x-16">
          <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 text-pink-600'
                          : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="px-4 py-10 sm:px-6 lg:flex-auto lg:px-0 lg:py-16">
            <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Name</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">{user.name}</div>
                      <button type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                        Update
                      </button>
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
                <h2 className="text-base font-semibold leading-7 text-gray-900">Bank accounts</h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">Connect bank accounts to your account.</p>

                <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  {
                    Object.keys(accounts).map(key => {
                      return (
                        <div key={key} className="flex justify-between gap-x-6 py-6">
                          <li >
                            { accounts[key].map(a => <div className="font-medium text-gray-900">{a.official_name}</div>) }
                          </li>
                          <button onClick={() => removeToken(accounts[key].access_token)} type="button" className="font-semibold text-red-600 hover:text-red-500">
                            Remove
                          </button>
                        </div>
                      )
                    })
                  }
                </ul>

                <div className="flex border-t border-gray-100 pt-6">
                  <button type="button" className="text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500">
                    <span aria-hidden="true">+</span> Add another bank
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Emails and Communications</h2>
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
          </main>
        </div>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const user = session?.user
  if(!user) return {
    redirect: {
      destination: '/',
      permanent: false,
    }
  }
  let linked_user = null
  if(user.linked_user_id){
    linked_user = await prisma.user.findUnique({
      where: { id: user.linked_user_id }
    })
  }

  const a = await prisma.accounts.findMany({
    where: {
      user_id: user.id,
      active: true,
    },
    select: {
      official_name: true,
      access_token: true
    },
  })
  const accounts = a.reduce(function (r, a) {
    r[a.access_token] = r[a.access_token] || [];
    r[a.access_token].push(a);
    return r;
  }, Object.create(null))
  
  return { props: { user, linked_user, accounts } }
}