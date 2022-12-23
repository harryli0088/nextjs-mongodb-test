import { InferGetServerSidePropsType } from 'next'
import getListing from '../../lib/listing/getListing';
import Button from 'react-bootstrap/Button';

import styles from "./listing.module.scss"
import { getSession, useSession } from 'next-auth/react';

export async function getServerSideProps(context:any) {
  try {
    const session = await getSession(context)
    const _id = context.query.slug?.[0]
    if (_id) {
      return {
        props: { listing: await getListing(_id, session?.user?.email || null) }, //TODO only return available listings
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

  if(listing) {
    const buttonText = (() => {
      if(session?.user?.email) {
        if(listing.sellerId === session.user.email) { //if this listing belongs to the seller
          return "Edit TODO"
        }
        else if(listing.buyerId === session.user.email) {
          return "TODO"
        }
        else {
          return "Buy TODO"
        }
      }
    })()

    return (
      <section>
        <div id={styles.listing}>
          <div id={styles.images}>
            <img src="/imgs/blue_box.svg" alt="thumbnail for listing"/>
          </div>

          <div id={styles.content}>
            <h2>{listing.title}</h2>

            <p>{listing.description}</p>

            <p style={{marginBottom:5}}>Price</p>
            <p style={{fontSize:"1.2em",marginTop:0,fontWeight:"bold"}}>${listing.price}</p>

            <Button>{buttonText}</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>This listing does not exist :{"("}</section>
  )
}