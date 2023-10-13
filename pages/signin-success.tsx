import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'

export default function () {
  return null
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const user = session?.user

  // @ts-ignore
  if(user && user?.active){
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
    return {
      redirect: {
        destination: '/visionboard',
        permanent: false,
      },
    }
  }
}