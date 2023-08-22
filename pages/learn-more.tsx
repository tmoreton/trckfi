import Container from '../components/container'
import Menu from '../components/landing-page/menu'
import Layout from "../components/layout"
import Meta from '../components/meta'
import Hero from "../components/landing-page/hero"
import FeatureCenter from "../components/landing-page/feature-center"
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