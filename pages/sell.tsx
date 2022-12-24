import Head from 'next/head'
import { useSession } from 'next-auth/react'

import ListingForm from '../components/ListingForm/ListingForm'
import Link from 'next/link'
import { Button } from 'react-bootstrap'

export default function Sell() {
  const { data: session, status } = useSession() 

  return (
    <>
      <Head>
        <title>Create Next App | Sell</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        {session?.user?.email ? <ListingForm/> : (
          <>
            <p>Log in or create a new account to make a new listing</p>
            <Link href='/api/auth/signin'>
              <Button>Login</Button>
            </Link>
          </>
        )}
      </section>
    </>
  )
}

