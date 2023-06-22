
import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="hidden lg:flex lg:gap-x-12">
        <b>{session.user.email}</b>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}