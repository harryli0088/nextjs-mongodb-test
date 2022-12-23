import Head from 'next/head'
import { InferGetServerSidePropsType } from 'next'
import { getSession, useSession } from 'next-auth/react'
import getListings from '../lib/listings/getListings'
import Listing from "../components/Listing/Listing"
import { FieldValues, useForm } from 'react-hook-form';
import Router from 'next/router'
import { getListingRoute } from '../lib/routes'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import styles from "./index.module.scss"

export async function getServerSideProps(context:any) {
  try {
    const session = await getSession(context)
    const listings = await getListings(session?.user?.email || null);

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
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header id={styles.header}>
        <div>
          <h1>A Catchy Heading</h1>
          <Form.Control type="text" placeholder='Search for a listing TODO' />
        </div>
      </header>

      <section>
        <div>
          <CreateListingForm/>
        </div>

        <div id={styles.listings}>
          {listings.map((l,i) => <Listing key={i} listing={l}/>)}
        </div>
      </section>
    </>
  )
}

function CreateListingForm() {
  // const [description, setDescription] = useState<string>("")
  // const [price, setPrice] = useState<number>(500)
  // const [title, setTitle] = useState<string>("")

  // const onSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()


  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await fetch("/api/listing", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      
      const body = await response.json()
      Router.push(getListingRoute(body._id.toString()))
    }
    catch (error) {
      console.error(error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Create a New Listing</h3>

      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control {...register('title', { required: true, minLength: 1, maxLength:50 })} />
      </Form.Group>
      {errors.title && <p>Title is required.</p>}

      <br/>
      
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control {...register('description', { required: true, minLength: 1, maxLength:200 })} />
      </Form.Group>
      {errors.description && <p>Description is required.</p>}

      <br/>
      
      <Form.Group>
        <Form.Label>Price</Form.Label>
        <Form.Control {...register('price', { pattern: /\d+/, min:1, max: 1000000, value:500 })} />
      </Form.Group>
      {errors.price && <p>Please enter number for price.</p>}

      <br/>
      
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}