import { InferGetServerSidePropsType } from 'next'
import getListing from '../../lib/listing/getListing';
import Button from 'react-bootstrap/Button';

import styles from "./listing.module.scss"
import { getSession, useSession } from 'next-auth/react';
import getEmailFromSession from '../../lib/getEmailFromSession';
import ListingForm from '../../components/ListingForm/ListingForm';

export async function getServerSideProps(context:any) {
  try {
    const session = await getSession(context)
    const _id = context.query.slug?.[0]
    if (_id) {
      return {
        props: { listing: await getListing(_id, getEmailFromSession(session) || null) }, //TODO only return available listings
      }
    }
    return {
      props: { listing: null },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { listing: null },
    }
  }
}

export default function ListingPage({
  listing,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession()
  const email = getEmailFromSession(session)

  if(listing) {
    const isSeller = listing.sellerId === email
    const isBuyer = listing.buyerId === email

    const content = (() => {
      if(isSeller) {
        return <ListingForm listing={listing}/>
      }

      return (
        <>
          <h2>{listing.title}</h2>

          <p>{listing.description}</p>

          <p style={{marginBottom:5}}>Price</p>
          <p style={{fontSize:"1.2em",marginTop:0,fontWeight:"bold"}}>${listing.price}</p>

          <Button>{isBuyer ? "isBuyer TODO" : "Buy TODO"}</Button>
        </>
      )
    })()

    return (
      <section>
        <div id={styles.listing}>
          <div id={styles.images}>
            <img src="/imgs/blue_box.svg" alt="thumbnail for listing"/>
          </div>

          <div id={styles.content}>
            {content}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>This listing does not exist :{"("}</section>
  )
}