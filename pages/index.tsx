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

export default function Index({ showError, host }) {
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
      <Container>
        <Features />
        <FeatureCenter />
        <FeatureLeft />
        <FeatureRight />
        <FeatureNetWorth />
        <Newsletter showError={showError} />
      </Container>
    </Layout>
  )
}