import { ListingInterface } from "../../types/listing"

export default function publicizeListing(listing:ListingInterface, userId:string|null) {
  listing.buyerId!==userId && (listing.buyerId = null) //if this user is not the buyer, clear the buyerId field
  listing.sellerId!==userId && (listing.sellerId = null) //if this user is not the seller, clear the sellerId field
  return listing
}