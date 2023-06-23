import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"

export default function ({ data }) {
  const { user } = data
  if (!user) {
    return (
      <button className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
        Login
      </button>
    )
  }
  return "User is logged in"
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return { props: { data: session } }
}