import { useState, useEffect } from 'react'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import ErrorModal from '../components/modals/error-modal'
import SuccessAlert from '../components/success-alert'
import Script from 'next/script'
import AuthGuard from '../utils/authGuard'
import Meta from '../components/meta'
import 'intro.js/introjs.css';
import '../styles/index.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [error, showError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const [steps, setSteps] = useState([])
  const { meta } = pageProps
  const router = useRouter()

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init('873379571171153')
        ReactPixel.pageView()

        router.events.on('routeChangeComplete', () => {
          console.log(router.route)
          ReactPixel.pageView()
        })
      })
  }, [router.events])

  const showIntro = (page) => {
    switch (page) {
      case 'visionboard':
        setSteps([{
          element: '.visionboard-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Welcome to your personal Visionboard 🤩</b></p>
              <p className="text-md my-3">Here you can add text, images and goals to align with where you see yourself long term</p>
            </div>,
          position: 'top',
        }])
        setEnabled(true)
        break;
      case 'dashboard':
        setSteps([{
          element: '.dashboard',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Dashboard 📷</b></p>
              <p className="text-md my-3">A snapshot of your finances in one place</p>
            </div>,
          position: 'top',
        },
        // {
        //   element: '.question-step',
        //   intro: 
        //     <div className="text-center">
        //       <p className="text-pink-600"><b>Question of the Day ✏️</b></p>
        //       <p className="text-md my-3">Elevate Financial Literacy and Earn Subscription Credits by Answering Daily Questions.</p>
        //     </div>,
        //   position: 'bottom',
        // },
        {
          element: '.savings-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Savings Rate</b></p>
              <p className="text-md my-3">Track what percentage of money your saving each month</p>
            </div>,
          position: 'bottom',
        },
        {
          element: '.expenses-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Expenses</b></p>
              <p className="text-md my-3">Compare how much you spent vs. previous months</p>
            </div>,
          position: 'bottom',
        },
        {
          element: '.income-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Income</b></p>
              <p className="text-md my-3">Compare how much you earned vs. previous months</p>
            </div>,
          position: 'bottom',
        },{
          element: '.pie-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Categories</b></p>
              <p className="text-md my-3">See what categories you spend most in</p>
            </div>,
          position: 'top',
        },{
          element: '.bar-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Historical</b></p>
              <p className="text-md my-3">Check your overall financial trends over time</p>
            </div>,
          position: 'top',
        },{
          element: '.transaction-step',
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Transactions</b></p>
              <p className="text-md my-3"></p>
            </div>,
          position: 'top',
        }])
        setEnabled(true)
        break;
      default:
        console.log('nope');
    }
  }
  
  // const onBeforeChange = nextStepIndex => {
  //   if (nextStepIndex === 1) {
  //     setEnabled(false)
  //     router.push({
  //       pathname: '/dashboard',
  //     })
  //   }
  // }

  return (
    <>
      <Meta meta={meta} />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YDKZMNYK8E" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-YDKZMNYK8E');
        `}
      </Script>

      {/* Google Tag Manager */}
      <Script src="https://www.googletagmanager.com/ns.html?id=GTM-MV5KVPVS" />
      <Script id="google-tag-manager">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MV5KVPVS');
        `}
      </Script>
      
      <SessionProvider session={session}>
        <SuccessAlert success={success} setSuccess={setSuccess} /> 
        <ErrorModal error={error} />
          {/* <Steps
            enabled={enabled}
            steps={steps}
            initialStep={0}
            // onBeforeChange={onBeforeChange}
            onExit={() => console.log('done')}
          /> */}
          <AuthGuard>
            {
              process.env['NEXT_PUBLIC_BASE_URL'].includes('demo') &&
              <div className="block gap-x-6 bg-pink-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                <p className="text-sm leading-6 text-white font-semibold text-center">
                  Welcome to the Trckfi Demo! 🎉
                </p>
              </div>
            }
            <Component {...pageProps} showError={showError} showIntro={showIntro} setSuccess={setSuccess}/>
          </AuthGuard>
        <Analytics />
      </SessionProvider>
    </>
  )
}
