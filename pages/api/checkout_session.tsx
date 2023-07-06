import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { email } = JSON.parse(req.body)
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: 'price_1NM9t4CCAkkOWnyTmWQXqfkF', 
          quantity: 1
        },
      ],
      mode: 'subscription',
      customer_email: email,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/getting-started?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
    return res.status(200).json(checkoutSession)
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}