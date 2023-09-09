import Menu from '../components/homepage/menu'
import Layout from "../components/layout"
import Meta from '../components/meta'
import Hero from "../components/homepage/hero"
import FeatureCenter from "../components/homepage/account-networth"
import Newsletter from "../components/newsletter"

export default function ({ showError }) {

  return (
    <Layout>
      <Meta
        title="Trckfi"
        description=""
        image=''
        keywords=''
      />
      <Menu showError={showError}/>
      <Hero />
      <FeatureCenter />
      <Newsletter showError={showError} />
    </Layout>
  )
}