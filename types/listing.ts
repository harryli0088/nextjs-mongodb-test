import type { WithId, Document } from 'mongodb'

export type ListingStatusType = "available"
| "reserved"
| "deposited"
| "shipped"
| "received"
| "completed"

export type ListingHistoryDescriptionType = "created"
| "seller edit" | "bought" | "shipped" | "arrived" | "received"

export type ListingHistoryType = {
  date: number,
  description: ListingHistoryDescriptionType,
}


export interface ListingInterface extends WithId<Document> {
  buyerId: string | null //this should be populated only if the user is the buyer
  description: string
  history: ListingHistoryType[]
  price: number
  sellerId: string | null //this should be populated only if the user is the seller
  status: ListingStatusType
  title: string
}