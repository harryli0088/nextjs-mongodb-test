import { ListingInterface, ListingStatusType } from '../../types/listing'
import publicizeListing from '../listing/publicizeListing';
import getDb from '../getDb';

export default async function getListings(userId:string|null, status?:ListingStatusType):Promise<ListingInterface[]> {
  const db = await getDb()

  const query = {
    $or: [ { buyerId: null }, { buyerId: userId }, { sellerId: userId } ], //user can only view this listing if they are the buyer or seller, or the listing is available, ie buyerId is null
    status,
  }
  if (!status) {
    delete query.status
  }

  const listings = (await db.collection("listings").find<ListingInterface>(query).toArray()).map((l) => publicizeListing(l,userId)) as ListingInterface[]

  return JSON.parse(JSON.stringify(listings))
}

