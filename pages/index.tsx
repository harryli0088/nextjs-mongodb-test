import Head from 'next/head'
import { InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import getListings from '../lib/listings/getListings'
import Listing from "../components/Listing/Listing"
import { FieldValues, useForm } from 'react-hook-form';
import Router from 'next/router'

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
      
      <div>
        <CreateListingForm/>
      </div>

      <div>
        {listings.map((l,i) => <Listing key={i} listing={l}/>)}
      </div>
    </div>
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
      Router.push(`/listing/${body._id}`)
    }
    catch (error) {
      console.error(error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Title
          <input {...register('title', { required: true, minLength: 1, maxLength:50 })} />
        </label>
      </div>
      {errors.title && <p>Title is required.</p>}
      
      <div>
        <label>
          Description
          <input {...register('description', { required: true, minLength: 1, maxLength:200 })} />
        </label>
      </div>
      {errors.description && <p>Description is required.</p>}
      
      <div>
        <label>
          Price
          <input {...register('price', { pattern: /\d+/, min:1, max: 1000000, value:500 })} />
        </label>
      </div>
      {errors.price && <p>Please enter number for price.</p>}
      
      <div>
        <input type="submit" />
      </div>
    </form>
  )
}