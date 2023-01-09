import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

import ListingForm from '../components/ListingForm/ListingForm'
import getTitle from '../lib/getTitle'

export default function Sell() {
  const { user, error, isLoading } = useUser()

  return (
    <>
      <Head>
        <title>{getTitle("Sell")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <br/>
        {user ? <ListingForm/> : (
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

