import Congrats from '../components/congrats'
import { signIn } from "next-auth/react"
import prisma from '../lib/prisma';

export default function ({ data }) {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center">
              Let's Get Started!
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              First let's create an account for you. We use email magic links so no passwords to forgot!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <CheckoutBtn />
              <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
