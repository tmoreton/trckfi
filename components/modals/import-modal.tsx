import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Importer, ImporterField } from 'react-csv-importer'
import 'react-csv-importer/dist/index.css'
import { useRouter } from 'next/router'

export default function ({ showError, open, setOpen, user, setRefreshing }) {
  const router = useRouter()

  const upload = async (rows) => {
    setRefreshing(true)
    await fetch(`/api/import_csv`, {
      body: JSON.stringify({
        rows,
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setTimeout(() => {
      router.reload()
    }, 10000)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
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
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-screen-xl">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-center text-2xl font-semibold text-pink-600">
                        Import Transactions
                      </Dialog.Title>

                      <div className="mx-auto mt-2 text-center">
                        <Importer
                          dataHandler={async (rows) => {
                            // required, receives a list of parsed objects based on defined fields and user column mapping;
                            // may be called several times if file is large
                            // (if this callback returns a promise, the widget will wait for it before parsing more data)
                            console.log("received batch of rows", rows)
                            
                            await upload(rows)                            
                          }}
                          chunkSize={10000} // optional, internal parsing chunk size in bytes
                          defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
                          restartable={false} // optional, lets user choose to upload another file when import is complete
                          onStart={({ file, fields }) => {
                            // optional, invoked when user has mapped columns and started import
                            console.log("starting import of file", file, "with fields", fields);
                          }}
                          onComplete={({ file, fields }) => {
                            // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
                            console.log("finished import of file", file, "with fields", fields);
                          }}
                          onClose={() => {
                            // optional, invoked when import is done and user clicked "Finish"
                            // (if this is not specified, the widget lets the user upload another file)
                            console.log("importer dismissed");
                            setOpen(false)
                          }}
                        >
                          <ImporterField name="name" label="Description" />
                          <ImporterField name="primary_category" label="Category" />
                          <ImporterField name="detailed_category" label="Detailed Category" optional />
                          <ImporterField name="date" label="Date" />
                          <ImporterField name="account_name" label="Account Name" optional/>
                          <ImporterField name="amount" label="Amount" />
                          <ImporterField name="notes" label="Notes" optional/>
                          <ImporterField name="labels" label="Labels" optional/>
                          <ImporterField name="type" label="Transaction Type" optional/>
                        </Importer>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}