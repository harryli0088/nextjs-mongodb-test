import clientPromise from '../mongodb'
import { ListingInterface } from '../../types/listing'

export default async function getListings():Promise<ListingInterface[]> {
  const client = await clientPromise;
  const db = client.db("test");

  const listings = (await (await db.collection("listings").find<ListingInterface>({}).toArray()).map((listing) => {
    delete listing.buyerId
    delete listing.sellerId
    return listing
  })) as ListingInterface[]

  return JSON.parse(JSON.stringify(listings))
}

