import { SessionProvider } from 'next-auth/react'

import Navbar from "../components/Navbar.tsx"

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