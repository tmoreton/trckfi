import { Fragment } from 'react'
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import DashboardLayout from "../components/dashboard-layout"
import Menu from '../components/menu'
import Meta from '../components/meta'
import { addComma } from '../lib/lodash'

export default function Recurring({ showError }) {
	const { data: session } = useSession()
  const user = session?.user
	const [recurring, setRecurring] = useState([])

	useEffect(() => {
		getRecurring()
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
    const { error, data } = await res.json()
    showError(error)
		setRecurring(data)
		console.log(data)
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
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="mt-8 flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
								<table className="min-w-full">
									<thead className="bg-white">
										<tr>
											<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-3">
												Name
											</th>
											<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
												Frequency
											</th>
											<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
												Last Amount
											</th>
											<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
												Last Date
											</th>
											<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">
												Categories
											</th>
										</tr>
									</thead>
									<tbody className="bg-white">
										{recurring.map((i) => (
											<Fragment key={i.id}>
													<tr className="border-gray-300 border-t">
														<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">
															{i.description}
														</td>
														<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{i.frequency}</td>
														<td className="whitespace-nowrap px-3 py-4 text-xs text-gray-500">{addComma(i.last_amount)}</td>
														<td className="whitespace-nowrap px-3 py-4 text-xs">{i.last_date}</td>
														<td className="text-xs text-gray-500 ">
															<span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{i.primary_category}</span>
															<span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{i.detailed_category}</span>
														</td>
													</tr>
											</Fragment>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</>
  )
}
