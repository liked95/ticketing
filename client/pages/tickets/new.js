import { useState } from "react"
import useRequest from "../hooks/use-request"
import Router from 'next/router'

const NewTicket = () => {

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = (event) => {
        event.preventDefault()
        doRequest()
    }

    const onBlur = (event) => {
        const value = parseFloat(price)
        console.log("🚀 ~ onBlur ~ value:", value)
        if (isNaN(value)) {
            return
        }

        setPrice(value.toFixed(2))
    }

    return (
        <div className="container mt-5 mw-500" >
            <h1 className="text-center mb-4">Create New Ticket</h1>
            <form onSubmit={onSubmit} className="shadow p-4 rounded bg-light">
                <div className="form-group mb-3">
                    <label className="form-label">Title</label>
                    <input
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label className="form-label">Price</label>
                    <input
                        className="form-control"
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-100">Submit</button>
                {errors && <div className="alert alert-danger mt-3">{errors}</div>}
            </form>
        </div>
    )
}

export default NewTicket