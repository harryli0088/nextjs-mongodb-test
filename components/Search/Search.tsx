import { useState } from 'react'
import Link from 'next/link';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import { ListingInterface } from '../../types/listing'

import styles from "./Search.module.scss"

export default function Search() {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<ListingInterface[]>([])

  const handleSearch = (query: string) => {
    setIsLoading(true);

    fetch(`/api/listings/search/${query}`)
      .then((resp) => resp.json())
      .then((options: ListingInterface[]) => {
        setOptions(options);
        setIsLoading(false);
      });
  }

  const filterBy = () => true;

  return (
    <div id={styles.search}>
      <AsyncTypeahead
        filterBy={filterBy}
        id="async-example"
        isLoading={isLoading}
        labelKey="title"
        minLength={3}
        onSearch={handleSearch}
        options={options}
        placeholder="Search for a listing..."
        //@ts-ignore
        renderMenuItemChildren={(option: ListingInterface) => (
          <Link href={`/listing/${option._id}`}><div>{option.title}</div></Link>
        )}
      />
    </div>
  )
}

