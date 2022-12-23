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

// TODO scenarios
// seller waiting to ship / buyer waiting for seller to ship
// package in transit
// buyer receives package / seller waiting for buyer to confirm receipt

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
        //TODO can't edit if no longer available
        return <ListingForm listing={listing}/>
      }

      const buy = async () => {
        try {
          const response = await fetch("/api/listing/buy", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({_id:listing._id}) // body data type must match "Content-Type" header
          })
          
          const body = await response.json()
          location.reload()
        }
        catch (error) {
          console.error(error)
        }
      }

      return (
        <>
          <h2>{listing.title}</h2>

          <p>{listing.description}</p>

          <p style={{marginBottom:5}}>Price</p>
          <p style={{fontSize:"1.2em",marginTop:0,fontWeight:"bold"}}>${listing.price}</p>

          {isBuyer ? <Button>TODO</Button> : <Button onClick={() => buy()}>Buy</Button>}
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