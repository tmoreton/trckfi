import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { email } = req.body
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_ID, 
          quantity: 1
        },
      ],
      mode: 'subscription',
      customer_email: email,
      subscription_data: {
        trial_period_days: 30,
      },
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/getting-started?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
    return res.status(200).json(checkoutSession)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}