import Stripe from 'stripe'
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { price_id, referral_id, email } = req.body
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: price_id, 
          quantity: 1
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30
      },
      allow_promotion_codes: true,
      consent_collection: {
        terms_of_service: 'required'
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing?session_id={CHECKOUT_SESSION_ID}`,
    }
    
    if(email && email !== 'undefined') {
      params.customer_email = email
    }

    if(price_id === process.env.NEXT_PUBLIC_STRIPE_BETA_MONTHLY_PRICE_ID){
      params.discounts = [{ coupon: process.env.STRIPE_BETA_COUPON_ID }]
      delete params.allow_promotion_codes 
    }

    // Check if user was referred by a friend
    if(referral_id && referral_id !== 'undefined'){
      const referral_user = await prisma.user.findUnique({
        where: { referral_id },
      })

      if(Object.keys(referral_user).length > 0) {
        params.discounts = [{ coupon: process.env.STRIPE_COUPON_ID }]
        delete params.allow_promotion_codes 
        params.success_url= `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&referral_id=${referral_id}`
      }
    }

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
    return res.status(200).json(checkoutSession)
  } catch (e) {
    console.error(e)
    slackMessage('Error checkout_session: ' + e.message || e.toString())
    throw new Error(e)
  }
}