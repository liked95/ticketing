const OrderShow = ({ order }) => {
    console.log('order is sss', order)
    const msLeft = new Date(order.expiresAt) - new Date()
    console.log('expire', order.expiresAt)
    console.log("🚀 ~ OrderShow ~ msLeft:", msLeft)
    return (
        <div className="container mt-5">
            {msLeft / 1000} seconds until order expires
        </div>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    const { data: order } = await client.get(`/api/orders/${orderId}`)
    return { order }
}

export default OrderShow;