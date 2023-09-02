import Container from '../components/container'
import Hero from '../components/hero'
import Layout from '../components/layout'
import Newsletter from '../components/newsletter'
import Menu from '../components/menu'
import Meta from '../components/meta'
import BudgetHero from "../components/landing-page/budget-hero"
import FeatureCenterLeanding from "../components/landing-page/feature-center"

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
      <BudgetHero />
      <FeatureCenterLeanding />
      <Newsletter showError={showError} />
    </Layout>
  )
}