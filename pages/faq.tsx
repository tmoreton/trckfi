import Menu from '../components/menu'
import Container from "../components/container"
import Layout from "../components/layout"

const faqs = [
  {
    id: 1,
    question: "Does Trckfi sell my data?",
    answer: "Absolutely not! We prioritize your data privacy. Unlike some free services, we don't compromise your information. Our subscription-based model ensures that we can maintain the application without ever resorting to selling your data.",
  },
  {
    id: 2,
    question: "How do you connect to my bank account?",
    answer: "We utilize the Plaid API to securely connect with your bank transactions. Rest assured, we never retain any personal information or login credentials. Your privacy is paramount.",
  },
  {
    id: 3,
    question: "Can I request a feature?",
    answer: "Absolutely! We highly value your input and encourage you to share any ideas for enhancing the platform, whether it's new features or fixes. Your feedback is crucial in making Trckfi better.",
  },
  {
    id: 4,
    question: "What information is stored?",
    answer: "We store only concise bank transaction details and snapshots of your accounts at specific points in time. Your data is treated with utmost care, and we focus solely on the necessary information to provide you with a seamless experience.",
  },
]

export default function ({ showError }) {
  return (
    <Layout>
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
  