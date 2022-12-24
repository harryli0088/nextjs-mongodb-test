import { ListingInterface, ListingStatusType } from '../../types/listing'
import { ObjectId } from 'mongodb';
import publicizeListing from './publicizeListing';
import getDb from '../getDb';

export default async function getListing(_id:string, userId:string|null, status?:ListingStatusType) {
  const db = await getDb()

  const query = {
    _id: new ObjectId(_id),
    $or: [ { buyerId: null }, { buyerId: userId }, { sellerId: userId } ], //user can only view this listing if they are the buyer or seller, or the listing is available, ie buyerId is null
    status,
  }
  if (!status) {
    delete query.status
  }

  const listing = await db.collection("listings").findOne<ListingInterface>(query)
  if(listing) {
    publicizeListing(listing,userId)
  }

  return JSON.parse(JSON.stringify(listing)) as typeof listing
}

