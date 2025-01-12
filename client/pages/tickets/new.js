import { useState } from "react"
import useRequest from "../hooks/use-request"
import Router from 'next/router'

const NewTicket = () => {

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')

    const {doRequest, errors} = useRequest({
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
        <div className="container mt-5">
            <h1>Create new ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label>Title</label>
                    <input 
                        className="form-control" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Price</label>
                    <input 
                        className="form-control" 
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary">Submit</button>
                {errors}
            </form>
        </div>
    )
}

export default NewTicket