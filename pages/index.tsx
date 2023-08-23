import Container from '../components/container'
import Hero from '../components/hero'
import Layout from '../components/layout'
import Newsletter from '../components/newsletter'
import Features from '../components/features'
import FeatureCenter from '../components/feature-center'
import FeatureLeft from '../components/feature-left'
import FeatureRight from '../components/feature-right'
import FeatureNetWorth from '../components/feature-net-worth'
import Menu from '../components/menu'
import Meta from '../components/meta'
import HeroLanding from "../components/landing-page/hero"
import FeatureCenterLeanding from "../components/landing-page/feature-center"

export default function Index({ showError }) {
  return (
    <Layout>
      <Meta
        title="Trckfi"
        description=''
        image=''
        keywords=''
      />
      <Menu showError={showError}/>
      <HeroLanding />
      <FeatureCenterLeanding />
      <Newsletter showError={showError} />
      {/* <Container>
        <FeatureCenter />
        <FeatureLeft />
        <FeatureRight />
        <FeatureNetWorth />
      </Container> */}
    </Layout>
  )
}