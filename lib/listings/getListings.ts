import { ListingInterface } from '../../types/listing'
import publicizeListing from '../listing/publicizeListing';
import getDb from '../getDb';

export default async function getListings(userId:string|null):Promise<ListingInterface[]> {
  const db = await getDb()

  const listings = ((await db.collection("listings").find<ListingInterface>({}).toArray()).map((l) => publicizeListing(l,userId))) as ListingInterface[]

  return JSON.parse(JSON.stringify(listings))
}

