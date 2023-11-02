import { useState, useEffect } from 'react'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import ErrorModal from '../components/modals/error-modal'
import AuthGuard from '../utils/authGuard'
import Meta from '../components/meta'
import 'intro.js/introjs.css';
import '../styles/index.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'react-datepicker/dist/react-datepicker.css'
import Hotjar from '@hotjar/browser'
import Script from 'next/script'
import dynamic from 'next/dynamic' 

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), {
  ssr: false
});

const siteId = 3619138
const hotjarVersion = 6

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [error, showError] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const [steps, setSteps] = useState([])
  const { post } = pageProps

  const showIntro = (page) => {
    switch (page) {
      case 'visionboard':
        setSteps([{
          element: '.visionboard-step',
          hideNext: true,
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
          hideNext: false,
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Custom Dashboard 📷</b></p>
              <p className="text-md my-3">Here you can add text, images and goals to align with where you see yourself long term</p>
            </div>,
          position: 'top',
        },
        // {
        //   element: '.question-step',
        //   hideNext: false,
        //   intro: 
        //     <div className="text-center">
        //       <p className="text-pink-600"><b>Question of the Day ✏️</b></p>
        //       <p className="text-md my-3">Elevate Financial Literacy and Earn Subscription Credits by Answering Daily Questions.</p>
        //     </div>,
        //   position: 'bottom',
        // },
        {
          element: '.savings-step',
          hideNext: false,
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Savings!</b></p>
              <p className="text-md my-3"></p>
            </div>,
          position: 'top',
        },
        {
          element: '.expenses-step',
          hideNext: false,
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Expenses!</b></p>
              <p className="text-md my-3"></p>
            </div>,
          position: 'top',
        },
        {
          element: '.income-step',
          hideNext: false,
          intro: 
            <div className="text-center">
              <p className="text-pink-600"><b>Income!</b></p>
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

  useEffect(() => {
    if(!process.env['NEXT_PUBLIC_BASE_URL'].includes('localhost') && !process.env['NEXT_PUBLIC_BASE_URL'].includes('demo')){
      Hotjar.init(siteId, hotjarVersion);
    }
  }, [])
  
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
      <Meta post={post} />
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YDKZMNYK8E" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-YDKZMNYK8E');
        `}
      </Script>
      <SessionProvider session={session}>
        <ErrorModal error={error} />
          <Steps
            enabled={enabled}
            steps={steps}
            initialStep={0}
            // onBeforeChange={onBeforeChange}
            onExit={() => console.log('done')}
          />
          <AuthGuard>
            {
              process.env['NEXT_PUBLIC_BASE_URL'].includes('demo') &&
              <div className="block gap-x-6 bg-pink-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                <p className="text-sm leading-6 text-white font-semibold text-center">
                  Welcome to the Trckfi Demo! 🎉
                </p>
              </div>
            }
            <Component {...pageProps} showError={showError} showIntro={showIntro}/>
          </AuthGuard>
        <Analytics />
      </SessionProvider>
    </>
  )
}
