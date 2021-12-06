import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Poems | Home for 3D experiments</title>
                <meta name="description" content="Poems" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Components.L1.Canvas3D
                id={'Poems'}
                scenes={[
                    'Default',
                    'Poems',
                ]}
            />
        </div>
    )
}
