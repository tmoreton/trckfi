import { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import Container from '../components/container'
import Layout from '../components/layout'
import MainMenu from '../components/menu-main'
import { useRouter } from 'next/router'
import Image from 'next/image'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing ({ showError }) {
  const router = useRouter()  
  return (
    <Layout>
      <MainMenu showError={showError}/>
      <Container>
        <div className="bg-white">
          <main className="isolate">
            <div className="mx-auto max-w-7xl px-0 lg:px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-10 pt-24">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto lg:w-80 lg:min-w-[350px]">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl leading-tight">
                  Start Tracking Your Expenses Today!
                </h1>
                <p className="mt-6 text-md leading-8 text-gray-600">
                  Not sure where to get started? <br/> Try out this <b>Free</b> Google Sheets financial tracker.
                </p>
                <ul role="list" className="my-10 space-y-3 text-md leading-6 text-gray-600">
                  <li className="flex items-center gap-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                    Track transactions
                  </li>
                  <li className="flex items-center gap-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                    Custom Categories
                  </li>
                  <li className="flex items-center gap-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                    Google Sheets Integration
                  </li>
                </ul>
                <a href='https://docs.google.com/spreadsheets/d/1VHDJ4gsCkQCCZX8q4wD8AOdYv2prU3Du2A0iGzEiJjE/copy' className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-2xl font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Download Finance Tracker Here
                </a>
              </div>
              <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                <Image
                  src="/assets/csv-tracker.png"
                  alt="Trckfi Finance Dashboard Bundle"
                  className="max-w-5xl rounded-xl shadow-xl w-full"
                  width={1000}
                  height={500}
                  unoptimized={false}
                />
              </div>
            </div>
          </main>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Pricing - Your Money's Best Friend, No Exceptions",
        description: "Trckfi is your online all-in-one, user-friendly personal finance platform. Unlimited Bank Connections, Smart Automation, and Total Control of Your Finances.",
        keywords: "unlimited accounts, net worth analysis, collaborators, monthly & weekly recaps"
      },
    },
  }
}

