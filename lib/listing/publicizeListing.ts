import { ListingInterface } from "../../types/listing"

export default function publicizeListing(listing:ListingInterface) {
  delete listing.buyerId
  delete listing.sellerId
  return listing
}