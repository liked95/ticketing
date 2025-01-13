import { useState, useEffect } from 'react'
import StripeCheckOut from 'react-stripe-checkout'
import useRequest from '../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0)

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => {
            console.log(payment)
            Router.push('/orders')
        }
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)

        return () => clearInterval(timerId)
    }, [order])

    if (timeLeft < 0) {
        return <div>Order expires</div>
    }

    return (
        <div className="container mt-5">
            <div className="d-flex flex-column align-items-center">
                <div>Time left to pay: {timeLeft} seconds</div>
                <StripeCheckOut
                    token={({ id }) => doRequest({ token: id })}
                    stripeKey='pk_test_51QgJbQAJByBViNj7nqD0Qw87pgwDgK1gF2AR1v9jDqHOGLaWmL9fCjFFU42DrdJEKQA4Mwq4kz5Bo9FrjbJ2FF3B00Esye7Gc8'
                    amount={order.ticket.price * 100}
                    email={currentUser.email}
                />
                {errors}
            </div>
        </div>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    const { data: order } = await client.get(`/api/orders/${orderId}`)
    return { order }
}

export default OrderShow;