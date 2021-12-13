import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Shaders | Home for 3D experiments</title>
                <meta name="description" content="Shaders" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Shaders'}
                scenes={[
                    'Default',
                    'Shaders',
                ]}
            />
        </div>
    )
}
