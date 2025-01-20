import axios from 'axios'
import { useState } from 'react'


export default ({ url, method, body, onSuccess, onError }) => {
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)

    async function doRequest(props = {}) {
        try {
            setErrors(null)
            setLoading(true)
            const response = await axios[method](url, { ...body, ...props })
            onSuccess && onSuccess(response.data)
            return response.data
        } catch (error) {
            setErrors(
                <div className='alert alert-danger'>
                    <h4>...OOOPS</h4>
                    <ul className='my-0'>
                        {error.response.data.errors.map(err => (
                            <li key={err.message}> {err.message}</li>
                        ))}
                    </ul>
                </div>
            )
            onError && onError(error)
        } finally {
            setLoading(false)
        }
    }

    return { errors, doRequest, loading }
}