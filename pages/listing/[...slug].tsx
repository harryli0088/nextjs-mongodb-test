import React, { useMemo, useState } from 'react';
import { InferGetServerSidePropsType } from 'next'
import getListing from '../../lib/listing/getListing';
import Button from 'react-bootstrap/Button';

import styles from "./listing.module.scss"
import { getSession, useSession } from 'next-auth/react';
import getEmailFromSession from '../../lib/getEmailFromSession';
import ListingForm from '../../components/ListingForm/ListingForm';
import { ListingStatusType } from '../../types/listing';
import Link from 'next/link';

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

  const [editing,setEditing] = useState<boolean>(false)

  const BUYER_BEHAVIOR:{[key in ListingStatusType]:React.FC<any>} = {
    "available": () => <div><p>test</p></div>,
    "bought": () => {
      return <p>Received payment. Waiting for seller to ship.</p>
    },
    "shipped": () => {
      return (
        <div>
          <p>Package is en route. Track package: <Link href=".">fake tracking url</Link></p>
          <Button>I have received the package</Button>
        </div>
      )
    },
    "received": () => {
      return (
        <Button>Complete the transaction</Button>
      )
    },
    "completed": () => {
      return (
        <p>This listing transaction has been completed!</p>
      )
    },
  }

  const SELLER_BEHAVIOR:{[key in ListingStatusType]:React.FC<any>} = useMemo(() => ({
    "available": () => <Button onClick={() => setEditing(true)}>Edit this listing</Button>,
    "bought": () => {
      return (
        <div>
          <p>Received payment. Waiting you to ship the package.</p>
          <Button>Confirmed Package has been Shipped</Button>
        </div>
      )
    },
    "shipped": () => {
      return (
        <div>
          <p>Package is en route. Track package: <Link href=".">fake tracking url</Link>. Waiting for buyer to receive package.</p>
        </div>
      )
    },
    "received": () => {
      return (
        <p>Buyer has received package. Waiting for transation completion</p>
      )
    },
    "completed": () => {
      return (
        <p>This listing transaction has been completed!</p>
      )
    },
  }), [])

  if(listing) {
    const isSeller = listing.sellerId === email
    const isBuyer = listing.buyerId === email

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

    const content = (() => {
      if(editing) {
        return <ListingForm listing={listing} onSuccess={() => location.reload()}/>
      }

      const BuyerContent = BUYER_BEHAVIOR[listing.status]
      console.log("<BuyerContent/>",<BuyerContent/>)
      const SellerContent = SELLER_BEHAVIOR[listing.status]

      return (
        <>
          <h2>{listing.title}</h2>

          <p>{listing.description}</p>

          <p style={{marginBottom:5}}>Price</p>
          <p style={{fontSize:"1.2em",marginTop:0,fontWeight:"bold"}}>${listing.price}</p>

          {isBuyer && <BuyerContent/>}

          {isSeller && <SellerContent/>}


          {!isSeller && !isBuyer && <Button onClick={() => buy()}>Buy</Button>}
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