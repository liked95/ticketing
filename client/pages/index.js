import axios from 'axios'

const LandingPage = ({ currentUser }) => {
    console.log('currentUser: ', currentUser)
    // axios.get('/api/users/currentuser').catch(console.log)

    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async () => {
    if (typeof window === 'undefined') {

    } else {
        
    }


    return {}
}

export default LandingPage