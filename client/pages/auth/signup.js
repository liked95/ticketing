import { useState } from 'react'
import useRequest from '../hooks/use-request'
import Router from 'next/router'

export default () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { errors, doRequest } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password },
        onSuccess: () => {
            Router.push("/")
        }
    })

    const onSubmit = async (event) => {
        event.preventDefault()
        doRequest()
    }
    return (
        <form onSubmit={onSubmit} className="container mt-5" style={{ maxWidth: '500px' }}>
            <h1 className="text-center mb-4">Sign Up</h1>
            <div className="form-group mt-4">
                <label>Email address</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
            </div>

            <div className="form-group mt-4">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </div>

            {errors && <div className="alert alert-danger mt-3">{errors}</div>}

            <button className="btn btn-primary btn-block mt-4">Sign Up</button>
        </form>
    )
}

