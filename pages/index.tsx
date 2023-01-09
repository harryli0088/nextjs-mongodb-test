import Head from 'next/head'
import { InferGetServerSidePropsType } from 'next'
import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';

import Container from 'react-bootstrap/Container'

import getListings from '../lib/listings/getListings'
import getTitle from '../lib/getTitle'
import Listing from "../components/Listing/Listing"
import Search from '../components/Search/Search';

import styles from "./index.module.scss"
import getEmailFromSession from '../lib/getEmailFromSession';

export async function getServerSideProps(context:any) {
  try {
    const session = await getSession(context.req, context.res)
    const listings = await getListings(getEmailFromSession(session), "available");

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
  const { user, error, isLoading } = useUser()

  console.log("listings",listings)

  return (
    <>
      <Head>
        <title>{getTitle("Home")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header id={styles.header}>
        <Container>
          <div id={styles["header-content"]}>
            <div style={{height: 200,maxWidth:500}}>
              <h1>A Catchy Heading</h1>
              
              <Search/>
            </div>
          </div>
        </Container>
      </header>
      
      <Container>
        <br/>
        <h3>Available Listings</h3>
        <div id={styles.listings}>
          {listings.map((l,i) => <Listing key={i} listing={l}/>)}

          {listings.length===0 && <p>There are currently no available listings.</p>}
        </div>
        <br/>
      </Container>
    </>
  )
}

