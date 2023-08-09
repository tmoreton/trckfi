import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { customer_id } = req.body
  try {
    await stripe.billingPortal.configurations.create({
      features: {
        customer_update: {
          allowed_updates: ['email', 'tax_id'],
          enabled: true,
        },
        invoice_history: {enabled: true},
        payment_method_update: {enabled: true},
        subscription_cancel: {enabled: true},
        subscription_pause: {enabled: true},
        // subscription_update: {
        //   default_allowed_updates: [],
        //   proration_behavior: 'none',
        //   enabled: true,
        //   products: [{product_id: 'price_1NdHHSBJfatAKl0YS5SSMmZ1'}]
        // },
      },
      business_profile: {
        privacy_policy_url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
        terms_of_service_url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms`,
      },
    });
    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
    });
    return res.status(200).json({ data: session.url })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}