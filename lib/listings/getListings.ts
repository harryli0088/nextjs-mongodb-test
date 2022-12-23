import clientPromise from '../mongodb'
import { ListingInterface } from '../../types/listing'
import publicizeListing from '../listing/publicizeListing';

export default async function getListings(userId:string|null):Promise<ListingInterface[]> {
  const client = await clientPromise;
  const db = client.db("test");

  const listings = ((await db.collection("listings").find<ListingInterface>({}).toArray()).map((l) => publicizeListing(l,userId))) as ListingInterface[]

  return JSON.parse(JSON.stringify(listings))
}

