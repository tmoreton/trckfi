import React, { useState } from 'react'
import getStripe from '../utils/get-stripejs'
import { useSession } from "next-auth/react"

const Checkout = () => {
  const { data: session } = useSession()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/checkout_session`, {
      body: JSON.stringify({ 
        email: session.user.email
      }),
      method: 'POST',
    })
    const response = await res.json()
    if (res.status === 500) return

    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      sessionId: response.id,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <button className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
        Sign Up
      </button>
    </form>
  )
}

export default Checkout