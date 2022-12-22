import Head from 'next/head'
import Link from 'next/link'
import { InferGetServerSidePropsType } from 'next'
import { getSession, signOut, useSession } from 'next-auth/react'
import getListings from '../lib/listings/getListings'
import Listing from "../components/Listing/Listing"

export async function getServerSideProps(context:any) {
  // // Check if the user is authenticated from the server
  // const session = await getSession(context)
  // console.log({ session })

  try {
    const listings = await getListings();

    return {
      props: { listings },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { listings: [] },
    }
  }
}

export default function Home({
  listings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession() 

  console.log("listings",listings)

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {listings.map((l,i) => <Listing key={i} listing={l}/>)}
    </div>
  )
}

