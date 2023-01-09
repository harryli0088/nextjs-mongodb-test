import type { WithId, Document } from 'mongodb'

export type ListingStatusType = "draft" | "available"
| "bought"
| "shipped"
| "received"
| "completed"

export type ListingHistoryDescriptionType = ListingStatusType
| "created" | "seller edit"

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