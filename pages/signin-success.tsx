import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'
import sendEmail from '../utils/sendEmail'
import utilServerSideDeviceDetection from '../utils/utilServerSideDeviceDetection'

export default function () {
  return null
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const { isMobile } = utilServerSideDeviceDetection(context)
  const user = session?.user
  // let user_accounts = await prisma.user.findUnique({
  //   where: { 
  //     // @ts-ignore
  //     id: user?.id
  //   },
  //   include: {
  //     accounts: true
  //   },
  // })

  // @ts-ignore
  if(user && user?.active){
    // @ts-ignore
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
    // user_accounts?.accounts?.length < 1
    if(user?.login_count < 1){
      await sendEmail(user.email)
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