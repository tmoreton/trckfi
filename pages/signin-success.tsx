import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'
import sendEmail from '../utils/sendEmail'

export default function () {
  return null
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const user = session?.user

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
    if(user?.login_count < 1){
      return {
        redirect: {
          destination: '/intro',
          permanent: false,
        },
      }
    } else {
      return {
        redirect: {
          destination: '/visionboard',
          permanent: false,
        },
      }
    }
  }
}