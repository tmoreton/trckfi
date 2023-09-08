import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { customer_id } = req.body
  try {
    const configuration = await stripe.billingPortal.configurations.create({
      features: {
        customer_update: {
          allowed_updates: [],
          enabled: false,
        },
        invoice_history: {enabled: true},
        payment_method_update: {enabled: true},
        subscription_cancel: {enabled: true},
        subscription_pause: {enabled: false},
        subscription_update: {
          default_allowed_updates: ["price", "promotion_code"],
          enabled: true,
          products: [{
            product: process.env.STRIPE_PRO_SUBSCRIPTION_ID, 
            prices: [process.env.STRIPE_PRO_MONTHLY_PRICE_ID, process.env.STRIPE_PRO_YEARLY_PRICE_ID]
          },{
            product: process.env.STRIPE_FAMILY_SUBSCRIPTION_ID, 
            prices: [process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID, process.env.STRIPE_FAMILY_YEARLY_PRICE_ID]
          }]
        },
      },
      business_profile: {
        privacy_policy_url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
        terms_of_service_url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms`,
      },
    });
    const session = await stripe.billingPortal.sessions.create({
      configuration: configuration.id,
      customer: customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    });
    return res.status(200).json({ data: session.url })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}