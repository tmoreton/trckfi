import { useState } from 'react'
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
// import Hotjar from '@hotjar/browser'
// import dynamic from 'next/dynamic' 

// const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), {
//   ssr: false
// });

const siteId = 3619138
const hotjarVersion = 6

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [error, showError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const [steps, setSteps] = useState([])
  const { meta } = pageProps

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

  // useEffect(() => {
  //   if(!process.env['NEXT_PUBLIC_BASE_URL'].includes('localhost') && !process.env['NEXT_PUBLIC_BASE_URL'].includes('demo')){
  //     Hotjar.init(siteId, hotjarVersion);
  //   }
  // }, [])
  
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

      {/* Meta Pixel Code */}
      <Script src="https://www.facebook.com/tr?id=873379571171153&ev=PageView&noscript=1" />
      <Script id="fb-tag">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '873379571171153');
          fbq('track', 'PageView');
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
