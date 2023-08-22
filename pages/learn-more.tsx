import Container from '../components/container'
import Menu from '../components/landing-page/menu'
import Layout from "../components/layout"
import Meta from '../components/meta'
import Hero from "../components/landing-page/hero"
import FeatureCenter from "../components/landing-page/feature-center"

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
      {/* <Container>
        <div className="absolute">
          <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
            <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800">
              <img
                src="/assets/visionboard-new.png"
                alt="Trckfi finance dashboard"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
          <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
          </div>
        </div>

        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[16px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
          <div className="rounded-xl overflow-hidden h-[140px] md:h-[262px]">
          <img
            src="/assets/dashboard-beta-full.png"
            alt="Vision Board"
            className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={2432}
            height={1442}
          />
          </div>
        </div>
        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl h-[24px] max-w-[301px] md:h-[42px] md:max-w-[512px]"></div>
        <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[55px] max-w-[83px] md:h-[95px] md:max-w-[142px]"></div>
      </Container> */}
    </Layout>
  )
}