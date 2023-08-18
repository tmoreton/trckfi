import Stripe from 'stripe'
import prisma from '../../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { email, referral_id } = req.body
  try {
    // Check if user was referred by a friend
    let discounts = []
    if(referral_id){
      const referral_user = await prisma.user.findUnique({
        // @ts-ignore
        where: { referral_id },
      })
      if(referral_user) discounts = [{ coupon: process.env.STRIPE_COUPON_ID }]
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_ID, 
          quantity: 1
        },
      ],
      mode: 'subscription',
      customer_email: email,
      // subscription_data: {
      //   trial_period_days: 30,
      // },
      allow_promotion_codes: discounts.length < 0 ? false : true,
      discounts,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&referral_id=${referral_id}`,
      cancel_url: `${req.headers.origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
    return res.status(200).json(checkoutSession)
  } catch (error) {
    console.error(error)
    throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}