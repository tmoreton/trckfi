
import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="flex items-center">
        <b>{session.user.email}</b>
        <br/>
        <button onClick={() => signOut()} className="block mx-4 rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
          Sign Out <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    )
  }
  return (
    <>
      <button onClick={() => signIn()} className="block mx-4 rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
        Sign In <span aria-hidden="true">&rarr;</span>
      </button>
    </>
  )
}