import Menu from '../components/menu'
import Container from "../components/container"
import Layout from "../components/layout"
import Meta from '../components/meta'

const faqs = [
  {
    id: 1,
    question: "Does Trckfi sell my data?",
    answer: "Never! This is why we don't have a free tirer, so that we can sustain the application without ever selling your data",
  },
  {
    id: 2,
    question: "How do you connect to my bank account?",
    answer: "We use Plaid API to connect to your bank transactions so we don't store any personal information or login details at all",
  },
  {
    id: 3,
    question: "Can I request a feature?",
    answer: "Yes! We love feedback and would love to hear what features and/or fixes that would improve the platform",
  },
  {
    id: 4,
    question: "What information is stored?",
    answer: "Only single line bank transactions and snapshot's of account's at a point in point and nothing else!",
  },
]

export default function ({ showError }) {
  return (
    <Layout>
      <Meta
        title="FAQ"
        description="Trckfi is transaparent about how your data is used and stored"
        image=''
        keywords=''
      />
      <Menu showError={showError} />
      <Container>
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Have a different question and can’t find the answer you’re looking for? Reach out to our support team by{' '}
                <a href="mailto:support@trckfi.com" className="font-semibold text-pink-600 hover:text-pink-500">
                  sending us an email
                </a>{' '}
                and we’ll get back to you as soon as we can.
              </p>
            </div>
            <div className="mt-20">
              <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:gap-x-10">
                {faqs.map((faq) => (
                  <div key={faq.id}>
                    <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
  