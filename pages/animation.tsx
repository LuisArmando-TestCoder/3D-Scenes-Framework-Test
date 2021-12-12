import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Animation | Home for 3D experiments</title>
                <meta name="description" content="Animation" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Animation'}
                scenes={[
                    'Default',
                    'Animation',
                ]}
            />
        </div>
    )
}
