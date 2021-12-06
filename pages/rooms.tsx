import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Rooms | Home for 3D experiments</title>
                <meta name="description" content="Rooms" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Rooms'}
                scenes={[
                    'Default',
                    'Rooms'
                ]}
            />
        </div>
    )
}
