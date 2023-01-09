import React, { useMemo, useState } from 'react';
import { InferGetServerSidePropsType } from 'next'
import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';

import Head from 'next/head';
import Link from 'next/link';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faFlagCheckered, faTruck } from '@fortawesome/free-solid-svg-icons';

import FETCH_OPTIONS from '../../lib/fetchOptions';
import getEmailFromSession from '../../lib/getEmailFromSession';
import getListing from '../../lib/listing/getListing';
import getTitle from '../../lib/getTitle';
import ListingForm from '../../components/ListingForm/ListingForm';
import { ListingStatusType } from '../../types/listing';

import styles from "./listing.module.scss"

export async function getServerSideProps(context:any) {
  try {
    const session = await getSession(context.req, context.res)
    const _id = context.query.slug?.[0]
    if (_id) {
      return {
        props: {
          listing: await getListing(
            _id, 
            getEmailFromSession(session),
          )
        }, //TODO only return available listings
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
  const { user, error, isLoading } = useUser()
  const email = user?.email || null

  const [editing,setEditing] = useState<boolean>(false)

  if(listing) {
    const isSeller = listing.sellerId === email
    const isBuyer = listing.buyerId === email

    const ship = async () => {
      try {
        const response = await fetch("/api/listing/ship", { //TODO make a variable
          ...FETCH_OPTIONS,
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          body: JSON.stringify({_id:listing._id}) // body data type must match "Content-Type" header
        })
        
        const body = await response.json()
        location.reload()
      }
      catch (error) {
        console.error(error)
      }
    }

    const receive = async () => {
      try {
        const response = await fetch("/api/listing/receive", { //TODO make a variable
          ...FETCH_OPTIONS,
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          body: JSON.stringify({_id:listing._id}) // body data type must match "Content-Type" header
        })
        
        const body = await response.json()
        location.reload()
      }
      catch (error) {
        console.error(error)
      }
    }

    const complete = async () => {
      try {
        const response = await fetch("/api/listing/complete", { //TODO make a variable
          ...FETCH_OPTIONS,
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          body: JSON.stringify({_id:listing._id}) // body data type must match "Content-Type" header
        })
        
        const body = await response.json()
        location.reload()
      }
      catch (error) {
        console.error(error)
      }
    }
  
    const BUYER_BEHAVIOR:{[key in ListingStatusType]:React.FC<any>} = {
      "draft": () => <div><p>test</p></div>,
      "available": () => <div><p>test</p></div>,
      "bought": () => {
        return <Alert variant="secondary"><FontAwesomeIcon icon={faTruck}/> Received payment. Waiting for seller to ship...</Alert>
      },
      "shipped": () => {
        return (
          <div>
            <p>Package is en route. Track package: <Link href="/">fake tracking url</Link></p>
            <Button onClick={() => receive()}><FontAwesomeIcon icon={faBox}/> I have received the package!</Button>
          </div>
        )
      },
      "received": () => {
        return (
          <Button onClick={() => complete()}><FontAwesomeIcon icon={faFlagCheckered}/> Complete the transaction!</Button>
        )
      },
      "completed": () => {
        return (
          <Alert variant='success'>This listing transaction has been completed!</Alert>
        )
      },
    }
  
    const SELLER_BEHAVIOR:{[key in ListingStatusType]:React.FC<any>} = useMemo(() => ({
      "draft": () => <div><p>test</p></div>,
      "available": () => <Button onClick={() => setEditing(true)}>Edit this listing</Button>,
      "bought": () => {
        return (
          <div>
            <p>Received payment. Waiting for you to ship the package.</p>
            <Button onClick={() => ship()}><FontAwesomeIcon icon={faTruck}/> Confirmed Package has been Shipped</Button>
          </div>
        )
      },
      "shipped": () => {
        return (
          <div>
            <p>Package is en route. Track package: <Link href="/">fake tracking url</Link>.</p>
            <Alert variant="secondary"><FontAwesomeIcon icon={faTruck}/> Waiting for buyer to receive package.</Alert>
          </div>
        )
      },
      "received": () => {
        return (
          <Alert variant="secondary">Buyer has received the package. Waiting for transation completion...</Alert>
        )
      },
      "completed": () => {
        return (
          <Alert variant='success'>This listing transaction has been completed!</Alert>
        )
      },
    }), [])

    const buy = async () => {
      try {
        const response = await fetch("/api/listing/buy", { //TODO make a variable
          ...FETCH_OPTIONS,
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
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
      const SellerContent = SELLER_BEHAVIOR[listing.status]

      return (
        <>
          <h2>{listing.title}</h2>

          <p style={{marginBottom:5}}>Price</p>
          <p style={{fontSize:"1.2em",marginTop:0,fontWeight:"bold"}}>${listing.price}</p>

          <p>{listing.description}</p>

          <hr/>
          

          {isBuyer && <BuyerContent/>}

          {isSeller && <SellerContent/>}


          {status!=="loading" && !isSeller && !isBuyer && <Button onClick={() => buy()}>Buy</Button>}
        </>
      )
    })()

    return (
      <>
        <Head>
          <title>{getTitle(`Buy | ${listing.title}`)}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container>
          <br/>
          <Row id={styles.listing}>
            <Col id={styles.images} md={6} sm={12}>
              <Carousel className={styles.carousel}>
                <Carousel.Item>
                  <img src="/imgs/orange_box.svg" alt="thumbnail for listing"/>
                  <Carousel.Caption>
                  </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img src="/imgs/blue_box.svg" alt="thumbnail for listing"/>

                  <Carousel.Caption>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>

            <Col id={styles.content} md={6} sm={12}>
              {content}
            </Col>
          </Row>
          <br/>
          <br/>
        </Container>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{getTitle(`Buy | Listing Not Found`)}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>This listing does not exist or is unavailable :{"("}</Container>
    </>
  )
}