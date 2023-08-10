import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

// const payload = {
//   id: 'evt_test_webhook',
//   object: 'event',
// };

// const payloadString = JSON.stringify(payload, null, 2);
// const secret = 'whsec_test_secret';

// const header = stripe.webhooks.generateTestHeaderString({
//   payload: payloadString,
//   secret,
// });

// const event = stripe.webhooks.constructEvent(payloadString, header, secret);

export default async (req, res) => {
  console.log(req.body)
  console.log(req.headers)
  try {
    const sig = req.headers['stripe-signature'];
    const payloadString = JSON.stringify(req.body, null, 2);

    // const header = stripe.webhooks.generateTestHeaderString({
    //   payload: payloadString,
    //   secret: req.headers['stripe-signature'],
    // })

    const event = stripe.webhooks.constructEvent(payloadString, sig, process.env.STRIPE_WEBHOOK_SECRET);

    console.log(event)
    switch (event.type) {
      case 'customer.subscription.created':
        const customerSubscriptionCreated = event.data.object;
        // Then define and call a function to handle the event customer.subscription.created
        break;
      case 'customer.subscription.deleted':
        const customerSubscriptionDeleted = event.data.object;
        // Then define and call a function to handle the event customer.subscription.deleted
        break;
      case 'customer.subscription.paused':
        const customerSubscriptionPaused = event.data.object;
        // Then define and call a function to handle the event customer.subscription.paused
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return res.status(200).json({ data: event })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}