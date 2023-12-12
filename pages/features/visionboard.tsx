import Link from 'next/link'
import Container from '../../components/container'
import Layout from '../../components/layout'
import MainMenu from '../../components/menu-main'
import SignupToday from '../../components/signup-today'

const features = [
  {
    name: "",
    description: "",
  },
  {
    name: "",
    description: "",
  },
  {
    name: "",
    description: "",
  },
]

export default function ({ showError }) {
  return (
    <Layout>
      <MainMenu showError={showError}/>
      <Container>
        <div className="py-16 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto text-center">
              <h4 className="text-base font-semibold leading-7 text-pink-600">Visionboard</h4>
              <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                Reshape your money mindset
              </h1>
              <p className="mt-6 text-md lg:text-xl lg:leading-8 text-gray-600">
              Stay motivated  and achieve your goals with Trckfi's Vision Board—a positive and playful canvas to connect with your financial ambitions. 
              By visually engaging with your objectives, you not only discover and clarify financial goals but also alleviate the anxiety of managing your finances. With Trckfi's Vision Board, unlock opportunities to achieve your goals through smarter daily money choices.
              </p>
              <div className="block mb-8 flex items-center justify-center gap-x-6">
                <Link href="/pricing" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Signup <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl lg:bg-gray-900/5 p-2 lg:ring-1 lg:ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  src="/assets/visionboard.png"
                  alt="Visualize your goals"
                  width={2432}
                  height={1442}
                  className="block rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
          <dl className="pt-24 mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <dt className="text-xl font-semibold leading-7 text-pink-600">
                  <div className="font-bold">{feature.name}</div>
                </dt>
                <dd className="mt-2 text-xl leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
      <SignupToday />
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Visionboard - Visualize your future and Transform Your Finances",
        description: "Experience your finances stress free by visualizing your money goals Customize every aspect of the screen with stickers, emojis, images, videos and much more to manifest the financial future you see for yourself!",
        keywords: "visualize goals",
        coverImage: "/assets/visionboard.png"
      },
    },
  }
}