import Container from '../components/container'
import Hero from '../components/hero'
import Layout from '../components/layout'
import Newsletter from '../components/newsletter'
import Menu from '../components/menu'
import Meta from '../components/meta'
import FeatureCenterLeanding from "../components/homepage/account-networth"

export default function Index({ showError }) {
  return (
    <Layout>
      <Meta
        title="Budgets Suck"
        description=''
        image=''
        keywords=''
      />
      <Menu showError={showError}/>
      <Hero />
      <FeatureCenterLeanding />
      <Newsletter showError={showError} />
    </Layout>
  )
}