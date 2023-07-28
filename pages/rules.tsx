import React, { useEffect } from 'react';
import DashboardLayout from "../components/dashboard-layout"
import Head from 'next/head'
import { useSession, signIn, signOut } from "next-auth/react"

const Rules = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    console.log(user)
  }, [])

  return(
    <DashboardLayout>
      <Head>
        <title>Trckfi - Rules</title>
      </Head>
    </DashboardLayout>
  )
}

Rules.requireAuth = true;

export default Rules