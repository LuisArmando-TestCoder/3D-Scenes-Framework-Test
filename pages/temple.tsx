import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Temple | Home for 3D experiments</title>
                <meta name="description" content="Temple" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Temple'}
                scenes={[
                    'Default',
                    'Temple',
                ]}
            />
        </div>
    )
}
