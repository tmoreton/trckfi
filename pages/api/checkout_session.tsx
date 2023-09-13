import Stripe from 'stripe'
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { price_id, referral_id } = req.body
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: price_id, 
          quantity: 1
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      consent_collection: {
        terms_of_service: 'required'
      },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      // customer_email: email,
      // cancel_url: `${req.headers.origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
    }

    // Check if user was referred by a friend
    if(referral_id){
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