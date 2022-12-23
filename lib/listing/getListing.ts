import { ListingInterface } from '../../types/listing'
import { ObjectId } from 'mongodb';
import publicizeListing from './publicizeListing';
import getDb from '../getDb';

export default async function getListing(_id:string, userId:string|null) {
  const db = await getDb()

  const listing = await db.collection("listings").findOne<ListingInterface>({_id: new ObjectId(_id)})
  if(listing) {
    publicizeListing(listing,userId)
  }

  return JSON.parse(JSON.stringify(listing)) as typeof listing
}

