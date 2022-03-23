import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Song1 | Home for 3D experiments</title>
                <meta name="description" content="Song1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <audio src="./audios/M83 - My Tears Are Becoming A Sea.mp3" loop={true} />
            <Components.L1.Canvas3D
                id={'Song1'}
                scenes={[
                    'Default',
                    'Song1',
                ]}
            />
        </div>
    )
}
