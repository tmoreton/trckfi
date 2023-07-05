# Trckfi Newsletter

npm run dev

npx primsa generate
npx prisma db push 
npx prisma db pull

```
{
  id: 'cs_test_a1pfJOT108pS9Gk4RXyuLgP2pJSDv9ZqOuzUCzQbBIlL3tCk6KeYF7qMUI',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 499,
  amount_total: 499,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
  cancel_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  created: 1688569098,
  currency: 'usd',
  currency_conversion: null,
  custom_fields: [],
  custom_text: { shipping_address: null, submit: null },
  customer: 'cus_OCx55ZPH5A1V6B',
  customer_creation: 'always',
  customer_details: {
    address: {
      city: null,
      country: 'US',
      line1: null,
      line2: null,
      postal_code: '33131',
      state: null
    },
    email: 'tmoreton89@gmail.com',
    name: 'Tim Moreton',
    phone: null,
    tax_exempt: 'none',
    tax_ids: []
  },
  customer_email: null,
  expires_at: 1688655497,
  invoice: 'in_1NQXB0CCAkkOWnyTvH4D8mfm',
  invoice_creation: null,
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'subscription',
  payment_intent: null,
  payment_link: null,
  payment_method_collection: 'always',
  payment_method_options: null,
  payment_method_types: [ 'card', 'link', 'cashapp' ],
  payment_status: 'paid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_details: null,
  shipping_options: [],
  status: 'complete',
  submit_type: null,
  subscription: 'sub_1NQXB0CCAkkOWnyTDWlNMSvl',
  success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: null
}

{
  id: 'cus_OCx55ZPH5A1V6B',
  object: 'customer',
  address: {
    city: null,
    country: 'US',
    line1: null,
    line2: null,
    postal_code: '33131',
    state: null
  },
  balance: 0,
  created: 1688569170,
  currency: 'usd',
  default_source: null,
  delinquent: false,
  description: null,
  discount: null,
  email: 'tmoreton89@gmail.com',
  invoice_prefix: 'BF3C7336',
  invoice_settings: {
    custom_fields: null,
    default_payment_method: null,
    footer: null,
    rendering_options: null
  },
  livemode: false,
  metadata: {},
  name: 'Tim Moreton',
  next_invoice_sequence: 2,
  phone: null,
  preferred_locales: [ 'en-US' ],
  shipping: null,
  tax_exempt: 'none',
  test_clock: null
}
```