import clientPromise from '../mongodb'
import { ListingInterface } from '../../types/listing'
import { ObjectId } from 'mongodb';
import publicizeListing from './publicizeListing';

export default async function getListing(id:string) {
  const client = await clientPromise;
  const db = client.db("test");

  const listing = await db.collection("listings").findOne<ListingInterface>({_id: new ObjectId(String(id))})
  if(listing) {
    publicizeListing(listing)
  }

  return JSON.parse(JSON.stringify(listing)) as typeof listing
}

