import Stripe from 'stripe'
import slackMessage from '../../utils/slackMessage'

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
            product: 'prod_OTQn41lBjC2ZJD', 
            prices: ['price_1NgTvdBJfatAKl0YD0UfX0aF', 'price_1NgTvcBJfatAKl0YAb4DRv9E']
          },{
            product: 'prod_OUAgEdZI2gYrgv', 
            prices: ['price_1NhCLaBJfatAKl0YmKWh1dR3', 'price_1NhCLaBJfatAKl0YT7Ur6IXu']
          }, {
            product: 'prod_Ol1euWJq7XXYBd', 
            prices: ['price_1NxVatBJfatAKl0YOYT8WPLy']
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
  } catch (e) {
    console.error(e)
    slackMessage('Error create_bill_portal: ' + e.message || e.toString())
    throw new Error(e)
  }
}