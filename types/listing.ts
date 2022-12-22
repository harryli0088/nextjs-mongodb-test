import { ObjectId } from "mongodb";
import type { WithId, Document } from 'mongodb'

export type ListingStatusType = "available"
| "reserved"
| "deposited"
| "shipped"
| "received"
| "completed"


export interface ListingInterface extends WithId<Document> {
  buyerId?: null | string
  description: string
  price: number
  sellerId?: string
  status: ListingStatusType
  title: string
}