import useRequest from "../hooks/use-request"
import Router from 'next/router'
import Head from "next/head"

const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: (order) => {
            Router.push('/orders/[orderId]', `/orders/${order.id}`)
        }
    })
    return (
        <div className="container mt-5 mw-500">
            <Head>
                <title>Ticket Detail: {ticket.title}</title>
            </Head>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body"></div>
                        <h1 className="card-title">{ticket.title}</h1>
                        <h4 className="card-text">Price: {ticket.price}</h4>
                        {errors}
                        <button className="btn btn-primary" onClick={(e) => doRequest()}>Purchase</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`)
    return { ticket }
}

export default TicketShow;