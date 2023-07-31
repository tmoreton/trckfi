import React, { useEffect, useState } from 'react';
import DashboardLayout from "../components/dashboard-layout"
import Head from 'next/head'
import { useSession } from "next-auth/react"
import { PinkBtn } from '../components/pink-btn'
import { snakeCase } from "snake-case";

const Rules = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [rules, setRules] = useState([])

  useEffect(() => {
    getRules()
  }, [])

  const getRules = async () => {
    const res = await fetch(`/api/get_rules`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    console.log(data)
    showError(error)
    setRules(data)
  }

  const createRule = async () => {
    const res = await fetch(`/api/add_rule`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user?.id,
        identifier: 'BEAGLE FINANCIAL'.toUpperCase(),
        ruleset: {
          name: 'BEAGLE',
          primary_category: snakeCase('GENERAL_SERVICES').toUpperCase(),
          detailed_category: snakeCase('OTHER_GENERAL_SERVICES').toUpperCase()
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  const removeRule = async (id) => {
    const res = await fetch(`/api/remove_rule`, {
      body: JSON.stringify({
        id: id,
        // @ts-ignore
        user_ud: user?.id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  return(
    <DashboardLayout>
      <Head>
        <title>Trckfi - Rules</title>
      </Head>

      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-2">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-lg font-bold leading-7 text-gray-900">Custom Rules</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Create rules to auto categorize or update transactions.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-gray-200 text-sm leading-6">
              <div className="sm:flex">
                <dt className="font-bold text-pink-600 sm:w-64 sm:flex-none sm:pr-6">Identifier</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="font-bold text-pink-600">Rules</div>
                </dd>
              </div>
              {rules.map(rule => (
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{rule.identifier}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div>
                    {Object.keys(rule?.ruleset)?.map(i => (
                      <>
                        <div className="text-xs font-medium text-gray-900 pb-1">{i} - 
                          <span className="pl-1 font-light">{rule?.ruleset[i]}</span> 
                        </div>
                      </>
                    ))}
                    </div>
                    <button type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                      Remove
                    </button>
                  </dd>
                </div>
              ))}
              <div className="flex border-t border-gray-100 pt-6">
                <button onClick={createRule} type="button" className="text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500">
                  <span aria-hidden="true">+</span> Create Rule
                </button>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-bold leading-7 text-gray-900">Upcoming Reminders</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              This information will be displayed publicly so be careful what you share.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Full name</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">Tom Cook</div>
                  <button type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                    Remove
                  </button>
                </dd>
              </div>
              {/* <div className="flex border-t border-gray-100 pt-6">
                <button type="button" className="text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500">
                  <span aria-hidden="true">+</span> Add another bank
                </button>
              </div> */}
            </dl>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}

export default Rules