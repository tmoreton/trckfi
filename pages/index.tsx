import Container from '../components/container'
import Hero from '../components/hero-2'
import Layout from '../components/layout'
import Head from 'next/head'
import Newsletter from '../components/newsletter'
import Features from '../components/features'
import FeatureCenter from '../components/feature-center'
import FeatureLeft from '../components/feature-left'
import FeatureRight from '../components/feature-right'
import FeatureNetWorth from '../components/feature-net-worth'
import Menu from '../components/menu'

export default function Index({ showError, host }) {
  return (
    <Layout>
      <Head>
        <title>Trckfi</title>
      </Head>
      {
        process.env['NEXT_PUBLIC_BASE_URL'].includes('demo') &&
        <div className="block gap-x-6 bg-pink-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <p className="text-sm leading-6 text-white font-semibold text-center">
            Welcome to the Trckfi Demo! 🎉
          </p>
        </div>
      }
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