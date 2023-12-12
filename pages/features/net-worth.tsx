import Link from 'next/link'
import Container from '../../components/container'
import Layout from '../../components/layout'
import MainMenu from '../../components/menu-main'
import SignupToday from '../../components/signup-today'

const features = [
  {
    name: "Sync your accounts",
    description: "Securely sync all of your bank accounts, loans, credit cards, and investments to pull in your assets and liabilities.",
  },
  {
    name: "Monitor your networth history",
    description: "We'll save a snapshot of your account balances and net worth each day so you can chart your progress.",
  },
  {
    name: "Flexible manual asset entry",
    description: "You can manually add any valuables, bank account balances, real estate, art or any collectibles, so you always have the complete picture.",
  },
  {
    name: "Crypto & single stocks ",
    description: "You can track your crypto investments and stocks even if a bank connection is not support by Plaid ",
  },
]

export default function ({ showError }) {
  return (
    <Layout>
      <MainMenu showError={showError}/>
      <Container>
        <div className="py-16 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto text-center">
              <h4 className="text-base font-semibold leading-7 text-pink-600">Net Worth</h4>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                Track your investments and portfolio
              </h1>
              <p className="mt-6 text-md lg:text-xl lg:leading-8 text-gray-600">
              Effortlessly all your bank accounts, credit cards, loans, and investments to Trckfi for seamless balance and net worth tracking. Your data is secured with bank-level protection, ensuring constant privacy. 
              Investments are a huge part of your financial life, and Trckfi’s investment tracker can help you stay on top of yours. Instantly see your asset allocation across all your investment accounts like 401(k), mutual funds, brokerage accounts, and even crypto. 
              </p>
              <div className="block mb-8 flex items-center justify-center gap-x-6">
                <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Signup <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl lg:bg-gray-900/5 p-2 lg:ring-1 lg:ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="/assets/networth.png"
                  alt="Watch your wealth grow over time"
                  width={2432}
                  height={1442}
                  className="hidden lg:block rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
                <div className="block lg:hidden relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl mt-">
                  <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    <img src="/assets/networth-mobile.png" className="rounded-lg" alt="Watch your wealth grow over time" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <dl className="pt-24 mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <dt className="text-xl font-semibold leading-7 text-pink-600">
                  <div className="font-bold">{feature.name}</div>
                </dt>
                <dd className="mt-2 text-xl leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
      <SignupToday />
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Net Worth - Track your investments and portfolio, stay on top of all of your accounts",
        description: "Effortlessly monitor net worth, assets, and liabilities in one user-friendly app. Take control of your financial future—retirement planning made easy.",
        keywords: "sync, bank accounts, crypto, stocks, index funds",
        coverImage: "/assets/networth.png"
      },
    },
  }
}