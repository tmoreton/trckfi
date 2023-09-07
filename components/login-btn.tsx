import { useSession, signIn, signOut } from "next-auth/react"
import { PinkBtn } from './pink-btn'

export default function () {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="flex items-center">
        <b>{session.user.email}</b>
        <br/>
        <PinkBtn type="button" onClick={signOut}>
          Sign Out
        </PinkBtn>
      </div>
    )
  }
  return (
    <PinkBtn type="button" onClick={signIn}>
      Sign In
    </PinkBtn>
  )
}