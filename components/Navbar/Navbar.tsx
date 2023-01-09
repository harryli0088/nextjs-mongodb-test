import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import styles from "./Navbar.module.scss"
import { ROUTES } from '../../lib/routes'

export default function Navbar() {
  const { user, error, isLoading } = useUser()

  const content = (() => {
    if (isLoading) {
      return <>Loading...</>
    }
    else if (user) {
      return (
        <div>
          Signed in as {user.email} &nbsp;
          <a href={ROUTES.LOGOUT}><Button>Sign out</Button></a>
        </div>
      )
    }
    else {
      return (
        <div>
          Not signed in &nbsp;
          <Link href={ROUTES.LOGIN}>
            <Button>Login</Button>
          </Link>
        </div>
      )
    }
  })()

  return (
    <nav id={styles.navbar}>
      <Container>
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
      </Container>
    </nav>
  )
}

