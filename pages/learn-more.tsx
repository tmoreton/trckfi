import Menu from '../components/homepage/menu'
import Layout from "../components/layout"
import Hero from "../components/homepage/hero"
import FeatureCenter from "../components/homepage/account-networth"
import Newsletter from "../components/newsletter"

export default function ({ showError }) {

  return (
    <Layout>
      <Menu showError={showError}/>
      <Hero />
      <FeatureCenter />
      <Newsletter showError={showError} />
    </Layout>
  )
}