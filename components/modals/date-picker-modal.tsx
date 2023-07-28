import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { DateRangePicker } from 'react-date-range'
import { DateTime } from "luxon"

export default function ({ openDatePicker, setDatePicker, dates, setDates, setReload }) {
  const [dateRange, updateDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  useEffect(() => {
    updateDateRange({
      startDate:  new Date(dates.endDate),
      endDate: new Date(dates.startDate),
      key: 'selection',
    })
  }, [dates])

  return (
    <div>
      <div className="py-3 flex justify-center gap-x-6 items-center">
        <button onClick={() => setDatePicker(true)} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-lg font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-pink-600 text-white hover:bg-pink-500 focus-visible:outline-pink-900">
          {new Date(dateRange.startDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </button>
        <p className="font-bold">-</p>
        <button onClick={() => setDatePicker(true)} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-lg font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-pink-600 text-white hover:bg-pink-500 focus-visible:outline-pink-900">
          {new Date(dateRange.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
        </button>
      </div>
      <Transition.Root show={openDatePicker} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setDatePicker(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 tranpink-y-4 sm:tranpink-y-0 sm:scale-95"
                enterTo="opacity-100 tranpink-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 tranpink-y-0 sm:scale-100"
                leaveTo="opacity-0 tranpink-y-4 sm:tranpink-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
                  <DateRangePicker
                    ranges={[dateRange]}
                    onChange={e => updateDateRange(e.selection)}
                  />
                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setDates({
                          startDate: dateRange.endDate,
                          endDate: dateRange.startDate
                        })
                        setReload(true)
                      }}
                    >
                      Appy
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setDatePicker(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}