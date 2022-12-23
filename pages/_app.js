import { SessionProvider } from 'next-auth/react'

import Navbar from "../components/Navbar/Navbar.tsx"

import 'bootstrap/dist/css/bootstrap.min.css'
import "../lib/styles.css"

export default function App ({
  Component,
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Navbar/>
      <Component {...pageProps} />
    </SessionProvider>
  )
}