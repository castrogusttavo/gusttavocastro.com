import '../public/static/css/prism.css'
import 'remixicon/fonts/remixicon.css'

import plausible from 'plausible-tracker'

import Router from 'next/router'
import * as gtag from '../lib/gtag'
import CommandBar from '../components/CommandBar'
import { useRouter} from 'next/router'
import { useEffect } from 'react'

Router.events.on('routeChangeComplete', url => gtag.pageview(url))

const Noop = ({ children }) => children

const { trackPageview } = plausible({
  domain: 'castrogusttavo.vercel.app',
})

export default function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || Noop

  const router = useRouter()

  useEffect(() => {
    trackPageview()

    router.events.on('routeChangeComplete', () => {
      trackPageview()
    })
  }, [])


  return (
    <CommandBar>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CommandBar>
  )
}
