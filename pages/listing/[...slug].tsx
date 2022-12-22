import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router';
import getListing from '../../lib/listing/getListing';

export async function getServerSideProps(context:any) {
  try {
    const id = context.query.slug?.[0]
    if (id) {
      return {
        props: { listing: await getListing(id) },
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
  if(listing) {
    return (
      <div>{listing.title}</div>
    )
  }

  return (
    <div>This listing does not exist :{"("}</div>
  )
}