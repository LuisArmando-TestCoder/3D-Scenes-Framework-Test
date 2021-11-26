import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import * as Components from '../components'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home for 3D experiments</title>
        <meta name="description" content="Home for 3D experiments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Components.L1.Canvas3D
        id={'ShowCase'}
        scenes={[
          'Default'
        ]}
      />
    </div>
  )
}

export default Home
