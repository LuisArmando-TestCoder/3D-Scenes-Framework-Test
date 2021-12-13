import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Links | Home for 3D experiments</title>
                <meta name="description" content="Links" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Links'}
                scenes={[
                    'Default',
                    'Links',
                ]}
            />
        </div>
    )
}
