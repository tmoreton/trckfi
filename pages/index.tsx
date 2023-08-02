import Container from '../components/container'
import Faq from '../components/faq'
import Hero from '../components/hero-2'
import Layout from '../components/layout'
import Head from 'next/head'
import Pricing from '../components/pricing'
import Newsletter from '../components/newsletter'
import Feature from '../components/feature'
import Menu from '../components/menu'

export default function Index({ showError, host }) {
  return (
    <Layout>
      <Head>
        <title>Trckfi</title>
      </Head>
      {
        host?.includes('demo') &&
        <div className="flex items-center gap-x-6 bg-pink-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <p className="text-sm leading-6 text-white">
            <strong className="font-semibold">Welcome to the Trckfi Demo! 🎉</strong>
          </p>
        </div>
      }
      <Menu showError={showError}/>
      <Hero />
      <Container>
        <Feature />
        {/* <Pricing /> */}
        <Faq />
        <Newsletter showError={showError} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  return {  props: { host: req?.headers?.host } }
}