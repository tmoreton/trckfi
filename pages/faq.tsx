import MainMenu from '../components/menu-main'
import Container from "../components/container"
import Layout from "../components/layout"
import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  // {
  //   id: 1,
  //   question: "Does Trckfi sell my data?",
  //   answer: "Absolutely not! We prioritize your data privacy. Unlike some free services, we don't compromise your information. Our subscription-based model ensures that we can maintain the application without ever resorting to selling your data.",
  // },
  // {
  //   id: 2,
  //   question: "How do you connect to my bank account?",
  //   answer: "We utilize the Plaid API to securely connect with your bank transactions. Rest assured, we never retain any personal information or login credentials. Your privacy is paramount.",
  // },
  // {
  //   id: 3,
  //   question: "Can I request a feature?",
  //   answer: "Absolutely! We highly value your input and encourage you to share any ideas for enhancing the platform, whether it's new features or fixes. Your feedback is crucial in making Trckfi better.",
  // },
  // {
  //   id: 4,
  //   question: "What information is stored?",
  //   answer: "We store only concise bank transaction details and snapshots of your accounts at specific points in time. Your data is treated with utmost care, and we focus solely on the necessary information to provide you with a seamless experience.",
  // },
  {
    id: 4,
    question: " Is my personal information shared or sold to third parties?",
    answer: "Absolutely not! Your data privacy is our top priority. At Trckfi, we are firmly committed to safeguarding your personal information and financial data. Unlike some free services, we never compromise your information by sharing or selling it to third parties. Our subscription-based model ensures that we can maintain the application without ever resorting to selling your data. Your trust in us is paramount, and we take every measure to uphold it.",
  },
  {
    id: 5,
    question: " How do I link my bank accounts and financial institutions to Trckfi?    ",
    answer: "We utilize the Plaid API to securely connect with your bank transactions. Rest assured, we never retain any personal information or login credentials. Your privacy is paramount.",
  },
  {
    id: 6,
    question: "Are there limitations on the number of accounts I can connect?",
    answer: "No, there are no limitations on the number of accounts you can connect within Trckfi. You can connect an unlimited number of bank accounts and investment accounts, and even add manual entries for any financial assets (stock, crypto, real estate, or physical assets) or liabilities you wish to track. Trckfi is designed to provide you with the flexibility to comprehensively manage all aspects of your financial portfolio in one place.",
  },
  {
    id: 8,
    question: "What types of financial accounts and institutions are supported?",
    answer: "Trckfi has you covered with support for over 1300 financial institutions! This includes major banks, credit unions, and investment firms, ensuring you have a wide range of options for managing your finances all in one place.",
  },
  {
    id: 10,
    question: "Do you share my data with third-party financial services or advertisers?",
    answer: "No, we don't share your data with third-party financial services or advertisers. Your data privacy is a top priority for us, and we are committed to keeping your information secure and confidential within Trckfi.",
  },
  {
    id: 11,
    question: "What information is stored?",
    answer: "We store only concise bank transaction details and snapshots of your accounts at specific points in time. Your data is treated with utmost care, and we focus solely on the necessary information to provide you with a seamless experience.",
  },
  {
    id: 13,
    question: "What are the pricing plans for Trckfi?",
    answer: "To explore our pricing plans for Trckfi, please visit our pricing page on our plans and pricing page. There, you'll find detailed information about our subscription tiers and the features included in each plan.",
  },
  {
    id: 14,
    question: "How do I cancel my subscription, and what is the refund policy?",
    answer: "Login to your Trckfi account. Go to Your Profile and click on the Cancel Subscription. To get a refund on your last month subscription email us at support@trckfi.com.",
  },
  {
    id: 15,
    question: "Can I switch between different subscription tiers?",
    answer: "Yes, you can absolutely switch between different subscription tiers within Trckfi. Whether you wish to upgrade or downgrade your plan, we provide the flexibility to adapt your subscription to better suit your financial management needs.",
  },
  {
    id: 17,
    question: "How often is my financial data updated within Trckfi?",
    answer: "Your financial data within Trckfi gets a refresh every day, and to be precise, it's updated every 8 hours for your convenience. Plus, we offer you the flexibility to manually sync data within the platform, so you can have an even more recent snapshot whenever you need it. We're all about keeping your financial information up-to-date and accessible whenever you want it.",
  },
  {
    id: 20,
    question: "How can I contact Trckfi's customer support team for assistance?",
    answer: "You're just an email away from getting in touch with our friendly Trckfi support team! Feel free to reach out to us at support@trckfi.com, and we'll do our best to get back to you as quickly as we can. We're here to help and make your Trckfi experience as smooth as possible. Your questions and concerns matter to us, so don't hesitate to drop us a line.",
  },
  {
    id: 21,
    question: "What is the typical response time for customer support inquiries?",
    answer: "Our typical response time for customer support inquiries is within 24 hours, although we always strive to answer your questions as swiftly as possible. Your concerns are important to us, and we're dedicated to providing timely assistance to ensure your Trckfi experience is as seamless as can be.",
  },
  {
    id: 23,
    question: "How can I delete my Trckfi account and associated data?",
    answer: "Login to your Trckfi account. Go to Your Profile and click on the Delete Your Trckfi Account option. After selecting Yes, your Trckfi account data will be removed.",
  },
  {
    id: 24,
    question: "What happens to my data after I close my account?",
    answer: "Your data is deleted.",
  },
  {
    id: 25,
    question: "Is there a process for exporting my financial data before closing my account?",
    answer: "You can use our export feature in the dashboard tab to download your expense and income tracking data",
  },
  {
    id: 26,
    question: "Can I provide feedback or suggest new features for Trckfi?",
    answer: "Absolutely! We highly value your input and encourage you to share any ideas for enhancing the platform, whether it's new features or fixes. Your feedback is crucial in making Trckfi better.",
  },
  {
    id: 27,
    question: "How often do you release updates and improvements based on user feedback?",
    answer: "We are committed to making the Trckfi platform better, faster, and more efficient based on user feedback. We release updates and improvements as often as possible to enhance your experience. Your feedback is invaluable in driving these enhancements, so please continue to share your ideas and suggestions with us. Together, we're dedicated to ensuring Trckfi remains a valuable tool for your financial management needs.",
  },
  // {
  //   id: 0,
  //   question: "",
  //   answer: "",
  // },
]

export default function ({ showError }) {
  return (
    <Layout>
      <MainMenu showError={showError} />
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
            <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
              <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
                {faqs.map((faq) => (
                  <Disclosure as="div" key={faq.question} className="pt-6">
                    {({ open }) => (
                      <>
                        <dt>
                          <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                            <span className="text-base font-semibold leading-7">{faq.question}</span>
                            <span className="ml-6 flex h-7 items-center">
                              {open ? (
                                <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                              ) : (
                                <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                          <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
  