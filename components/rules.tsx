import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from "next-auth/react"
import { XCircleIcon } from '@heroicons/react/24/outline'
import { PinkBtn } from '../components/pink-btn'
import { DateTime } from "luxon"
import  { useLocalStorage } from '../utils/useLocalStorage'

const keys = {
  name: 'Name',
  primary_category: 'Primary Category',
  detailed_category: 'Detailed Category',
  unified: 'Emoji',
  recurring: 'Recurring',
  active: 'Active'
}

const Rules = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [identifier, setIdentifier] = useState('')
  const [ruleset, setRuleset] = useState(null)
  const [rulesetId, setRulesetId] = useState(null)
  const [rules, setRules] = useLocalStorage('rules', [])
  const [alerts, setAlerts] = useLocalStorage('alerts', [])
  const [, updateState] = useState()
  // @ts-ignore
  const forceUpdate = useCallback(() => updateState({}), [])

  useEffect(() => {
    getRules()
    getAlerts()
  }, [])

  const getAlerts = async () => {
    const res = await fetch(`/api/get_alerts`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setAlerts(data)
  }

  const cancel = async () => {
    setRulesetId(null)
    setRuleset(null)
    setIdentifier('')
  }

  const editRule = async (i) => {
    setRulesetId(i.id)
    setRuleset(i.ruleset)
    setIdentifier(i.identifier)
  }

  const getRules = async () => {
    const res = await fetch(`/api/get_rules`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setRules(data)
  }

  const addRule = async () => {
    let newRuleset = ruleset
    delete newRuleset['']
    const res = await fetch(`/api/add_rule`, {
      body: JSON.stringify({
        id: rulesetId,
        // @ts-ignore
        user_id: user?.id,
        identifier,
        ruleset: newRuleset
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    setRuleset(null)
    showError(error)
    if(!error) getRules()
  }
  
  const removeRule = async (id) => {
    const res = await fetch(`/api/remove_rule`, {
      body: JSON.stringify({
        user,
        id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getRules()
  }
  
  const removeItem = async (key) => {
    if(key){
      let item = ruleset
      delete item[key]
      setRuleset(item)
      forceUpdate()
    }
  }

  const removeAlert = async (id) => {
    const res = await fetch(`/api/remove_alert`, {
      body: JSON.stringify({
        id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getAlerts()
  }

  return(
    <main className="px-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-2 mt-16">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-pink-600">Custom Rules</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
          Create rules to re-categorize current and future transactions
          </p>
          <dl className="mt-6 space-y-3 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {rules && rules?.map(rule => (
              <div className="pt-3 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{rule?.identifier}</dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div>
                    {Object.keys(rule?.ruleset)?.map(i => (
                      <div className="text-xs font-medium text-gray-900 pb-1">{i} - 
                        <span className="pl-1 font-light">{rule?.ruleset[i]}</span> 
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <button onClick={() => editRule(rule)} type="button" className="text-xs font-normal text-gray-500 hover:text-gray-400 mr-4">
                      Edit
                    </button>
                    <button onClick={() => removeRule(rule?.id)} type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                      Remove
                    </button>   
                  </div>
                </dd>
              </div>
            ))}
            {ruleset ?
              <div className="pt-6 sm:flex items-start">
                <dt className="font-medium text-gray-900 w-[350px] sm:flex-none sm:pr-6">
                  <label htmlFor="email" className="block text-sm font-small leading-6 text-pink-600">
                    Identifier
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    required
                    placeholder="Add Transaction name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                  />
                </dt>
                <dd className="mt-1 block justify-start gap-x-6 sm:mt-0 sm:flex-auto items-end">
                  <div className="mt-1 flex justify-start gap-x-6 sm:mt-0 sm:flex-auto items-end">
                    <label htmlFor="rule" className="block text-sm font-medium leading-6 text-pink-600 sm:w-64">
                      Rules
                    </label>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-pink-600">
                      Value
                    </label>
                  </div>
                  <select
                    name="rule"
                    value=''
                    onChange={e => setRuleset({ ...ruleset, [e.target.value]: '' })}
                    className="mt-2 block sm:w-64 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-pink-600 sm:text-sm sm:leading-6"
                  >
                    <option className="text-gray-500" value="" label="Select Value..." />
                    <option value="name" label="Name" />
                    <option value="primary_category" label="Primary Category" />
                    <option value="detailed_category" label="Detailed Category" />
                    <option value="active" label="Active" />
                  </select>
                  {Object.keys(ruleset).map((i, key) => (
                    <div key={i} className="mt-1 flex justify-start gap-x-6 sm:mt-0 sm:flex-auto items-center">
                      <div>
                        {i && <p className="mt-2 block sm:w-64 py-1.5 pl-3 pr-10 text-gray-900 sm:text-sm sm:leading-6">{keys[i]}</p>}
                      </div>
                      <div className="font-medium text-gray-900 sm:w-64 sm:flex-none">
                        { i === 'recurring' || i === 'active' ?
                          <select
                            name={i}
                            value={ruleset[i].recurring || ruleset[i].active}
                            onChange={e => setRuleset({ ...ruleset, [i]: e.target.value })}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-pink-600 sm:text-sm sm:leading-6"
                          >
                            <option value="" label="" />
                            <option value="true" label="True" />
                            <option value="false" label="False" />
                          </select>
                          :
                          <>
                          {i && 
                            <input
                              name={i}
                              onChange={e => setRuleset({ ...ruleset, [i]: e.target.value })}
                              value={ruleset[i]}
                              required
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                            />
                          }
                          </>
                        }
                      </div>
                      {i && <button onClick={() => removeItem(i)} type="button" >
                        <XCircleIcon className='text-red-400 group-hover:text-red-600 h-5 w-5 shrink-0' />
                      </button>}
                    </div>
                  ))}
                </dd>
                <div className="grid">
                  <PinkBtn type="button" onClick={addRule} >
                    {rulesetId ? 'Update Rule' : '+ Add Rule'}
                  </PinkBtn>
                  <button onClick={cancel} type="button" className="text-sm font-normal leading-6 text-gray-500 hover:text-gray-400 pt-4">
                    Cancel
                  </button>
                </div>
              </div>
              :
              <div className="flex pt-6">
                <button onClick={() => setRuleset({'': ''})} type="button" className="text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500">
                  <span aria-hidden="true">+</span> Create Rule
                </button>
              </div>
            }
          </dl>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-pink-600">Upcoming Reminders</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Never forget an upcoming subscription or reminder again
          </p>
          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {alerts.map(alert => (
              <div className="pt-6 sm:flex">
                <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{alert.name} - <span className="font-normal">{DateTime.fromISO(alert.alert_date).toLocaleString(DateTime.DATE_FULL)}</span></dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  { alert.notes && <div className="text-gray-900"><span className="font-semibold">Notes:</span> {alert.notes}</div>}
                  <button onClick={() => removeAlert(alert.id)} type="button" className="font-semibold text-pink-600 hover:text-pink-500">
                    Remove
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  )
}

export default Rules