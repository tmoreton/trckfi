import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import DashboardLayout from "../components/dashboard-layout"
import Menu from '../components/menu'
import Meta from '../components/meta'
import { addComma } from '../lib/lodash'
import  { useLocalStorage } from '../utils/useLocalStorage'
import LoadingModal from '../components/modals/loading-modal'
import RecurringModal from '../components/modals/recurring-modal'
import { DateTime } from "luxon"
import { primary } from '../lib/primary_categories'


export default function Recurring({ showError }) {
	const { data: session } = useSession()
  const user = session?.user
	const [recurring, setRecurring] = useLocalStorage('recurring', null)
	const [inactive, setInactive] = useLocalStorage('inactive', null)
	const [early, setEarly] = useLocalStorage('early', null)
  const [stats, setStats] = useLocalStorage('recurring_stats', null)
	const [loading, setLoading] = useState(false)
  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false)

	useEffect(() => {
		getRecurring()
		if(!recurring){
			setLoading(true)
		}
  }, [])

  const getRecurring = async () => {
    const res = await fetch(`/api/get_recurring`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, recurring, inactive, early, stats } = await res.json()
		setLoading(false)
    showError(error)
		setRecurring(recurring)
		setInactive(inactive)
		setEarly(early)
    setStats(stats)
  }

  const updateRecurring = async () => {
    const res = await fetch(`/api/update_recurring`, {
      body: JSON.stringify({
        user,
        item
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setOpen(false)
    setItem({})
    if(!error) getRecurring()
  }

  const removeRecurring = async () => {
    const res = await fetch(`/api/remove_recurring`, {
      body: JSON.stringify({
        user,
        item
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setOpen(false)
    setItem({})
    if(!error) getRecurring()
  }

	const diff = (date) => {
		let today = DateTime.now()
		let upcoming = DateTime.fromISO(date)
		let difference = upcoming.diff(today, ['days']).toObject()
		return Math.round(difference.days)
	}

  const editItem = (i) => {
		setOpen(true)
    setItem(i)
	}

  const renderImg = (account) => {
    if(account){
      let image_url = `/assets/banks/${account.institution}.png`
      return <img
        src={image_url}
        alt={account.institution}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src="/assets/banks/bank.png";
        }}
        className="h-5 w-5 flex-none rounded-md object-cover"
      />
    }
  }

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <Meta
          title="Recurring Charges"
          description="Find any unknown recurring transactions"
          image=''
          keywords=''
        />
				<LoadingModal refreshing={loading} text='Looking for Recurring Transactions...'/>
        <RecurringModal item={item} setItem={setItem} open={open} setOpen={setOpen} updateRecurring={updateRecurring} removeRecurring={removeRecurring}/>
				<div className="px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden">
            {/* Stats */}
            <div >
              <dl className="mx-auto grid max-w-7xl lg:px-2 xl:px-0">
                <div className="flex items-baseline flex-wrap justify-center gap-y-2 gap-x-4">
                  {stats && stats.map((i) => (
                    <div className="relative overflow-hidden rounded-lg bg-white py-4 shadow-sm rounded-md border-b border border-gray-200 w-48 mb-4">
                      <dt className="text-md font-xs leading-6 text-gray-600 text-center font-semibold">{`${primary[i.primary_category]?.icon || '💸'} ${primary[i.primary_category]?.name || i.primary_category.split('_')}`}</dt>
											<dt className="text-xs font-xs leading-6 text-gray-600 text-center font-normal">{i.frequency}<span className="text-xs italic font-normal ml-1 text-gray-600">est.</span></dt>
                      <dd className="text-blue-400 w-full flex-none text-3xl font-bold leading-10 tracking-tight text-center">
                        ${Math.abs(Math.round(i._sum.last_amount))}
                      </dd>
                    </div>
                  ))}
                </div>
              </dl>
            </div>
          </div>
					<div className="flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
								<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
									<table className="min-w-full divide-y divide-gray-300">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
													Name
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Account
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Frequency
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Category
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Last Amount
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Last Date
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Upcoming Charge
												</th>
												<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
													<span className="sr-only">Edit</span>
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200 bg-white">
											{recurring && recurring.map((i) => (
												<tr key={i.id}>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs overflow-hidden">
                            { i.custom_name || i.merchant_name || i.name }
													</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 inline-flex"><span className="mr-2">{renderImg(i.account)}</span> {i.account.name.split(' ').slice(0, 3).join(' ')}</td>
													<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{i.frequency}</td>
													<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
														<span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{i.primary_category}</span>
														{/* <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{i.detailed_category}</span> */}
													</td>
													{
														i.last_amount > 0 ?
														<td className="whitespace-nowrap px-3 py-4 text-sm text-green-500 font-semibold">{addComma(Math.abs(i.last_amount))}</td>
														:
														<td className="whitespace-nowrap px-3 py-4 text-sm text-red-500 font-semibold">{addComma(Math.abs(i.last_amount))}</td>
													}
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{i.last_date}</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 italic">
														<span className="text-xs">approx.</span>
														<span className="font-bold px-1">{diff(i.upcoming_date)}</span>
														<span className="text-xs">days</span>
													</td>
													<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
														<button onClick={() => editItem(i)} className="text-pink-600 hover:text-pink-900">Edit</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Early Detection */}
								<div className="max-w-7xl pt-10">
									<h2 className="max-w-3xl text-2xl font-bold leading-6 text-gray-900">
										Early Detection
									</h2>
								</div>

								<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mt-4">
									<table className="min-w-full divide-y divide-gray-300">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
													Name
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Account
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Frequency
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Last Amount
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Last Date
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Upcoming Charge
												</th>
												<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
													<span className="sr-only">Edit</span>
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200 bg-white">
											{early && early.map((i) => (
												<tr key={i.id}>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs overflow-hidden">
														{ i.custom_name || i.merchant_name || i.name }
													</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 inline-flex"><span className="mr-2">{renderImg(i.account)}</span> {i.account.name.split(' ').slice(0, 3).join(' ')}</td>
													<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{i.frequency}</td>
													{
														i.last_amount > 0 ?
														<td className="whitespace-nowrap px-3 py-4 text-sm text-green-500 font-semibold">{addComma(Math.abs(i.last_amount))}</td>
														:
														<td className="whitespace-nowrap px-3 py-4 text-sm text-red-500 font-semibold">{addComma(Math.abs(i.last_amount))}</td>
													}
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{i.last_date}</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 italic">
														<span className="text-xs">approx.</span>
														<span className="font-bold px-1">{diff(i.upcoming_date)}</span>
														<span className="text-xs">days</span>
													</td>
													<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button onClick={() => editItem(i)} className="text-pink-600 hover:text-pink-900">Edit</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Inactive */}
								<div className="max-w-7xl pt-10">
									<h2 className="max-w-3xl text-2xl font-bold leading-6 text-gray-900">
										Inactive
									</h2>
								</div>

								<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mt-4">
									<table className="min-w-full divide-y divide-gray-300">
										<thead className="bg-gray-50">
											<tr>
												<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
													Name
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Account
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Frequency
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Last Amount
												</th>
												<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
													Last Date
												</th>
												<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
													<span className="sr-only">Edit</span>
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200 bg-gray-50">
											{inactive && inactive.map((i) => (
												<tr key={i.id}>
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 max-w-xs overflow-hidden">
                            { i.custom_name || i.merchant_name || i.name }
													</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 inline-flex">{i.account.name.split(' ').slice(0, 3).join(' ')}</td>
													<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-300">{i.frequency}</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-semibold">{addComma(i.last_amount)}</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{i.last_date}</td>
													<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button onClick={() => editItem(i)} className="text-pink-600 hover:text-pink-900">Edit</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</>
  )
}
