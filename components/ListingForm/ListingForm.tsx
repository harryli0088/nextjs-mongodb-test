import Router from 'next/router'
import { Button, Form } from 'react-bootstrap'
import { FieldValues, useForm } from "react-hook-form"
import { getListingRoute } from "../../lib/routes"
import { ListingInterface } from '../../types/listing'

type Props = {
  listing?: ListingInterface,
  onSuccess?: () => void,
}

export default function ListingForm({listing,onSuccess}:Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: FieldValues) => {
    if(listing) { //we are updating an existing listing
      try {
        const response = await fetch("/api/listing", {
          method: 'PUT', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify({...data, _id:listing._id}) // body data type must match "Content-Type" header
        })
        
        const body = await response.json()
        onSuccess?.()
      }
      catch (error) {
        console.error(error)
      }
    }
    else { //we are creating a new listing
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
        // onSuccess?.()
      }
      catch (error) {
        console.error(error)
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>{listing ? "Edit Listing" : "Create a New Listing"}</h3>
      
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control {...register('title', { required: true, minLength: 1, maxLength:50, value: listing?.title || "" })} />
      </Form.Group>
      {errors.title && <p>Title is required.</p>}

      <br/>
      
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" {...register('description', { required: true, minLength: 1, maxLength:10000, value: listing?.description || "" })} />
      </Form.Group>
      {errors.description && <p>Description is required.</p>}

      <br/>
      
      <Form.Group>
        <Form.Label>Price</Form.Label>
        <Form.Control {...register('price', { pattern: /\d+/, min:1, max: 1000000, value: listing?.price || 500 })} />
      </Form.Group>
      {errors.price && <p>Please enter number for price.</p>}

      <br/>
      
      <div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}