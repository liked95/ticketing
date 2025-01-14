import axios from 'axios'

export default ({ req }) => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: process.env.CLIENT_BASE_URL,
            headers: req.headers
        })
    } else {
        return axios.create({
            baseURL: '/'
        })
    }
}