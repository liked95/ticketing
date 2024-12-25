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
        <form onSubmit={onSubmit}>
            <h1>Signup</h1>
            <div className="form-group">
                <label>Email address</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            {errors}

            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

