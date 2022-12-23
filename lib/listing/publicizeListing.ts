import { ListingInterface } from "../../types/listing"

export default function publicizeListing(listing:ListingInterface, userId:string|null) {
  if(listing.buyerId===userId) {
  }
  else { //this user is not the buyer
    listing.buyerId = null //clear the buyerId field
  }

  if(listing.sellerId===userId) {
  }
  else { //this user is not the seller
    listing.sellerId = null //clear the sellerId field
  }

  if(listing.buyerId===userId || listing.sellerId===userId) {
  }
  else { //this user is neither the buyer nor the seller
    listing.history = listing.history.slice(0) //clear the history except the created date
  }

  return listing
}