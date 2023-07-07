// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon"

export default async (req, res) => {
  try {
    await fetch(`/api/send_email`, {
      body: JSON.stringify({
        email: "tmoreton89@gmail.com",
        message: "This is the auto update test"
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    return res.status(200).json({ status: "Ok" })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}