import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import DashboardLayout from "../components/dashboard-layout"
import Menu from '../components/menu'
import Meta from '../components/meta'
import { addComma } from '../lib/lodash'
import  { useLocalStorage } from '../utils/useLocalStorage'
import LoadingModal from '../components/modals/loading-modal'
import { DateTime } from "luxon"

export default function Recurring({ showError }) {
	const { data: session } = useSession()
  const user = session?.user
	const [recurring, setRecurring] = useLocalStorage('recurring', null)
	const [inactive, setInactive] = useLocalStorage('inactive', null)
	const [early, setEarly] = useLocalStorage('early', null)
	const [loading, setLoading] = useState(false)

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
    const { error, recurring, inactive, early } = await res.json()
		setLoading(false)
    showError(error)
		setRecurring(recurring)
		setInactive(inactive)
		setEarly(early)
  }

	const diff = (date) => {
		let today = DateTime.now()
		let upcoming = DateTime.fromISO(date)
		let difference = upcoming.diff(today, ['days']).toObject()
		return Math.round(difference.days)
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
          title="Recurring Transactions"
          description="Find any unknown recurring transactions"
          image=''
          keywords=''
        />
				<LoadingModal refreshing={loading} text='Looking for Recurring Transactions...'/>
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<h1 className="max-w-3xl text-2xl font-bold leading-6 text-gray-900">Recurring & Subscriptions</h1>
							<p className="mt-2 text-sm text-gray-700">
								Never forget another subscription or recurring charge again!
							</p>
						</div>
					</div>
					<div className="mt-8 flow-root">
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
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
														{i.description.length > 25 ? `${i.description.substring(0, 25)}...` : i.description}
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
														<a href="#" className="text-pink-600 hover:text-pink-900">
															Edit<span className="sr-only">, {i.id}</span>
														</a>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>


								<div className="max-w-7xl pt-10">
									<h2 className="max-w-3xl text-2xl font-bold leading-6 text-gray-900">
										Early Detection
									</h2>
								</div>

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
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
														{i.description.length > 25 ? `${i.description.substring(0, 25)}...` : i.description}
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
														<a href="#" className="text-pink-600 hover:text-pink-900">
															Edit<span className="sr-only">, {i.id}</span>
														</a>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>


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
													<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6">
														{i.description.length > 25 ? `${i.description.substring(0, 25)}...` : i.description}
													</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 inline-flex">{i.account.name.split(' ').slice(0, 3).join(' ')}</td>
													<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-300">{i.frequency}</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-semibold">{addComma(i.last_amount)}</td>
													<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{i.last_date}</td>
													<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
														<a href="#" className="text-pink-600 hover:text-pink-900">
															Edit<span className="sr-only">, {i.id}</span>
														</a>
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
