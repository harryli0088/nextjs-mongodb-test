import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'


export default function Navbar() {
  const { data: session, status } = useSession() 

  const content = (() => {
    if (status === 'loading') {
      return <>Loading...</>
    }
  
    if (status === 'authenticated') {
      return (
        <div>
          Signed in as {session.user?.email} &nbsp;
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )
    }
    else {
      return (
        <div>
          Not signed in &nbsp;
          <Link href='/api/auth/signin'>
            Login
          </Link>
        </div>
      )
    }
  })()

  return (
    <nav>
      {content}
    </nav>
  )
}

