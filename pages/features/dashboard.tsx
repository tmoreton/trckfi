import Link from 'next/link'
import Container from '../../components/container'
import Layout from '../../components/layout'
import MainMenu from '../../components/menu-main'

export default function ({ showError }) {
  return (
    <Layout>
      <MainMenu showError={showError}/>
      <Container>
        <div className="py-16 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto text-center">
              <h4 className="text-base font-semibold leading-7 text-pink-600">Dashboard</h4>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                All of your financial data in one place
              </h1>
              <p className="mt-6 text-md lg:text-lg lg:leading-8 text-gray-600">
                Achieve financial clarity through our all-in-one money dashboard. Capture monthly snapshots of income, expenses, and savings effortlessly.
                Monitor account balances, net worth, and monthly spending by categories. Simplify money management, maintain a clear cash flow, and discover easy opportunities to save.
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
                  src="/assets/dashboard-no-menu.png"
                  alt="Feel confident with your money management"
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
                    <img src="/assets/dashboard-mobile.png" className="rounded-lg" alt="Feel confident with your money management" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}
