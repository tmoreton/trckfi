
import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div>
        <b>{session.user.email}</b>
        <br/>
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