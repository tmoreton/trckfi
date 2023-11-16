import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'
import sendEmail from '../utils/sendEmail'

export default function () {
  return null
}

export const utilServerSideDeviceDetection = (context)=> {
  const isServer = !!context.req
  const userAgent: string = isServer
    ? context.req.headers['user-agent']
    : navigator.userAgent
  const isLine = /\bLine\//i.test(userAgent) || false
  const isMobile = /(iPad|iPhone|Android|Mobile)/i.test(userAgent) || false
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari/)',
    'Android.*(wv|.0.0.0)'
  ]

  const regex = new RegExp(`(${rules.join('|')})`, 'ig')
  const isInApp = Boolean(userAgent.match(regex))

  return {
    isMobile,
    isLine,
    isInApp,
    userAgent
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const { isMobile } = utilServerSideDeviceDetection(context)
  const user = session?.user
  let user_accounts = await prisma.user.findUnique({
    where: { 
      // @ts-ignore
      id: user?.id
    },
    include: {
      accounts: true
    },
  })

  // @ts-ignore
  if(user && user?.active){
    // @ts-ignore
    if(user?.login_count < 1){
      sendEmail(user.email)
    }
    await prisma.user.update({
      where: { 
        // @ts-ignore
        id: user.id
      },
      data: { 
        login_count: {
          increment: 1,
        },
      }
    })
    // @ts-ignore
    if(user?.login_count < 1 || user_accounts?.accounts?.length < 1){
      return {
        redirect: {
          destination: '/intro/question-1',
          permanent: false,
        },
      }
    } else {
      if(isMobile){
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        }
      }
      return {
        redirect: {
          destination: '/visionboard',
          permanent: false,
        },
      }
    }
  }
}