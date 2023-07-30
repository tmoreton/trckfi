import React, { useEffect } from 'react';
import DashboardLayout from "../components/dashboard-layout"
import Head from 'next/head'
import { useSession } from "next-auth/react"
import { PinkBtn } from '../components/pink-btn'
import { snakeCase } from "snake-case";

const Rules = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
  }, [])

  const createRule = async () => {
    // e.preventDefault()
    const res = await fetch(`/api/add_rule`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user?.id,
        identifier: 'BEAGLE FINANCIAL',
        ruleset: {
          name: 'BEAGLE',
          primary_category: 'GENERAL_SERVICES',
          detailed_category: 'OTHER_GENERAL_SERVICES'
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  return(
    <DashboardLayout>
      <Head>
        <title>Trckfi - Rules</title>
      </Head>
      <PinkBtn onClick={createRule}>
        Create Rule
      </PinkBtn>
    </DashboardLayout>
  )
}

export default Rules