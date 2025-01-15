import 'bootstrap/dist/css/bootstrap.css'
import '../styles/global.css'
import buildClient from '../api/build-client'
import Header from '../components/header'
import Head from 'next/head'
import { useRouter } from 'next/router'

const AppComponent = ({ Component, pageProps, currentUser }) => {
    const router = useRouter()
    const isAuthRoute = router.pathname.startsWith('/auth')
    return <div>
        <Head>
            <title>Tickets for sure</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header currentUser={currentUser} />

        <div className={`container-md mt-4`} style={isAuthRoute ? { maxWidth: '500px' } : {}}>
            <Component {...pageProps} currentUser={currentUser} />
        </div>
    </div>
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentuser')

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        ...data
    };
}

export default AppComponent