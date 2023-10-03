import Layout from '../components/layout'
import Menu from '../components/menu'
import Meta from '../components/meta'
import Hero from "../components/homepage/hero"
import AccountNetworth from "../components/homepage/account-networth"
import Visonboard from '../components/homepage/visionboard'
import Newsletter from '../components/newsletter'

export default function Index({ showError }) {
  return (
    <Layout>
      <Menu showError={showError}/>
      <Hero />
      <AccountNetworth />
      <Visonboard />
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Newsletter showError={showError} />
        </div>
      </div>
    </Layout>
  )
}