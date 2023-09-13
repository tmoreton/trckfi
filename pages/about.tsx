import Container from '../components/container'
import Layout from '../components/layout'
import Menu from '../components/menu'
import Image from 'next/image'

const team = [
  {
    name: 'Tim Moreton',
    role: 'Co-Founder / CTO',
    imageUrl: '/assets/tim.png',
  },
  {
    name: 'Candelaria Reyna Moreton',
    role: 'Co-Founder / CEO',
    imageUrl: '/assets/cande.png',
  },
]

export default function About({ showError }) {
  return (
    <Layout>
      <Menu showError={showError}/>
      <Container>
        <div className="bg-white">
          <main className="isolate">
            {/* Hero section */}
            <div className="relative isolate -z-10 overflow-hidden sm:pt-14 pt-0">
              <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
                <h1 className="font-bold lg:col-span-2 xl:col-auto sm:text-7xl text-5xl tracking-tighter text-pink-600 leading-tight text-center">
                  Simplify Your Finances, Stress Less
                </h1>
                <Image
                  src="/assets/mallorca.png"
                  alt="Tim and Cande in Mallorca"
                  width={512}
                  height={427}
                  className="block sm:hidden my-5 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2"
                />
                <p className="text-xl sm:text-3xl font-normal text-gray-900 tracking-wide text-center mt-4 mb-10">
                  Discover how the Trckfi Platform empowers you to take control of your money and build confidence in your financial journey
                </p>
                <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8 items-center">
                  <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Our Story</h2>
                    <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                      <p className="text-xl leading-8 text-gray-600">
                        We're Cande and Tim, the minds behind Trckfi. We founded Trckfi because we believe finance management should be straightforward and stress-free. We were fed up with complex apps that overwhelmed us and compromised our data.
                        <br/>
                        <br/>
                        So, we created Trckfi—a simplified financial hub that not only enhances financial literacy but also provides clarity on your financial situation. Our mission? Empowering you to prioritize what truly matters through goal visualization, making financial success accessible to all.
                      </p>
                    </div>
                  </div>
                  <Image
                    src="/assets/mallorca.png"
                    alt="Tim and Cande in Mallorca"
                    width={512}
                    height={427}
                    className="hidden sm:block mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2"
                  />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
            </div>

            {/* Image section */}
            {/* <div className="mt-12 sm:mt-20 xl:mx-auto xl:max-w-7xl xl:px-8">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                alt=""
                className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
              />
            </div> */}

            {/* Values section */}
            {/* <div className="mx-auto mt-12 sm:mt-20 max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our values</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in
                  accusamus quisquam.
                </p>
              </div>
              <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {values.map((value) => (
                  <div key={value.name}>
                    <dt className="font-semibold text-gray-900">{value.name}</dt>
                    <dd className="mt-1 text-gray-600">{value.description}</dd>
                  </div>
                ))}
              </dl>
            </div> */}

            {/* Team section */}
            <div className="mx-auto max-w-7xl px-6 mt-24 sm:mt-24 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Our team</h2>
                {/* <p className="mt-6 text-lg leading-8 text-gray-600">
                  Sit facilis neque ab nulla vel. Cum eos in laudantium. Temporibus eos totam in dolorum. Nemo vel facere
                  repellendus ut eos dolores similique.
                </p> */}
              <ul
                role="list"
                className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center lg:mx-0 lg:max-w-none"
              >
                {team.map((person) => (
                  <li key={person.name}>
                    <img className="mx-auto sm:h-72 sm:w-72 h-36 w-36 rounded-full" src={person.imageUrl} alt={person.name} />
                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                    <p className="text-sm leading-6 text-gray-600">{person.role}</p>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </Container>
    </Layout>
  )
}
