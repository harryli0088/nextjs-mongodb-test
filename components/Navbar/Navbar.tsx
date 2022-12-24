import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import styles from "./Navbar.module.scss"
import Button from 'react-bootstrap/Button'


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
          <Button onClick={() => signOut()}>Sign out</Button>
        </div>
      )
    }
    else {
      return (
        <div>
          Not signed in &nbsp;
          <Link href='/api/auth/signin'>
            <Button>Login</Button>
          </Link>
        </div>
      )
    }
  })()

  return (
    <nav id={styles.navbar}>
      <div id={styles["first-row"]}>
        <Link href="/"><p id={styles.logo}>Logo</p></Link>
        {content}
      </div>

      <br/>
      
      <div id={styles["second-row"]}>
        <Link href="/">Buy</Link>
        <Link href="/sell">Sell</Link>
        <Link href="/">Option</Link>
        <Link href="/">Option</Link>
        <Link href="/">Option</Link>
      </div>
    </nav>
  )
}

