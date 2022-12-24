import { useSession } from 'next-auth/react'
import Link from 'next/link'

import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import ListingForm from '../components/ListingForm/ListingForm'
import getTitle from '../lib/getTitle'

export default function Sell() {
  const { data: session, status } = useSession() 

  return (
    <>
      <Head>
        <title>{getTitle("Sell")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <br/>
        {session?.user?.email ? <ListingForm/> : (
          <>
            <p>Log in or create a new account to make a new listing</p>
            <Link href='/api/auth/signin'>
              <Button>Login</Button>
            </Link>
          </>
        )}
        <br/>
      </Container>
    </>
  )
}

