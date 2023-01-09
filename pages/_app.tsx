import { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0/client'

import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

import 'bootstrap/dist/css/bootstrap.min.css'
import "../lib/styles.css"

export default function App ({
  Component,
  pageProps,
}: AppProps<{}>) {
  return (
    <UserProvider>
      <Navbar/>
      <Component {...pageProps} />
      <Footer/>
    </UserProvider>
  )
}