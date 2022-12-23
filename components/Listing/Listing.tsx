import Link from 'next/link'
import { getListingRoute } from '../../lib/routes'
import { ListingInterface } from '../../types/listing'
import styles from './Listing.module.scss'


export default function Listing({listing}:{listing:ListingInterface}) {
  return (
    <Link className={styles.listing} href={getListingRoute(listing._id.toString())}>
      <img src="/imgs/blue_box.svg" alt="thumbnail for listing" width="200"/>
      
      <h2>{listing.title}</h2>

      <hr/>

      <p>{listing.description}</p>
    </Link>
  )
}

