import Stripe from 'stripe'
import prisma from '../../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { email, referral_id } = req.body
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID, 
          quantity: 1
        },
      ],
      mode: 'subscription',
      consent_collection: {
        terms_of_service: 'required'
      },
      customer_email: email,
      success_url: referral_id ? `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&referral_id=${referral_id}` : `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
    }

    // Check if user was referred by a friend
    if(referral_id){
      const referral_user = await prisma.user.findUnique({
        where: { referral_id },
      })

      if(referral_user) {
        params.discounts = [{ coupon: process.env.STRIPE_COUPON_ID }]
      } else {
        params.allow_promotion_codes = true
      }
    }
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
    return res.status(200).json(checkoutSession)
  } catch (error) {
    console.error(error)
    throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}