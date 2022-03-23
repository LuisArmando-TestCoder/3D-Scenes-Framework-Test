import Head from 'next/head'
import * as Components from '../components'

export default () => {
    return (
        <div>
            <Head>
                <title>Gibran0 | Home for 3D experiments</title>
                <meta name="description" content="Gibran0" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <audio src="./audios/Gibran 0.mp3" loop={true} />
            <Components.L0.Message text="Press P to toggle audio"/>
            <Components.L1.Canvas3D
                id={'Gibran0'}
                scenes={[
                    'Default',
                    'Gibran0',
                ]}
            />
        </div>
    )
}
