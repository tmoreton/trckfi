
import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div>
        <b>{session.user.email}</b>
        <br/>
        <button onClick={() => signOut()}>Sign Out <span aria-hidden="true">&rarr;</span></button>
      </div>
    )
  }
  return (
    <>
      <button onClick={() => signIn()}>Sign In <span aria-hidden="true">&rarr;</span></button>
    </>
  )
}