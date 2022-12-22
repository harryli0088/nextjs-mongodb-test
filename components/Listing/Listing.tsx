import { ListingInterface } from '../../types/listing'
import styles from './Listing.module.scss'


export default function Listing({listing}:{listing:ListingInterface}) {
  return (
    <div className={styles.listing}>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
    </div>
  )
}

