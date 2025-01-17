import useRequest from "../hooks/use-request"
import Router from 'next/router'
import Head from "next/head"

const TicketShow = ({ ticket, currentUser }) => {
    console.log("🚀 ~ TicketShow ~ currentUser:", { ticket, currentUser })
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: (order) => {
            Router.push('/orders/[orderId]', `/orders/${order.id}`)
        }
    })

    const handlePurchase = (e) => {
        doRequest()
    }

    const handleEdit = (e) => {
        Router.push('/tickets/edit/[ticketId]', `/tickets/edit/${ticket.id}`)
    }
    return (
        <div className="container mt-5">
            <Head>
                <title>Ticket Detail: {ticket.title}</title>
            </Head>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow border-0 rounded-lg">
                        <div
                            className="card-header text-white text-center py-4"
                            style={{
                                background: 'linear-gradient(to right, #333, #111)',
                                borderBottom: '2px solid #555',
                            }}
                        >
                            <h1
                                className="card-title mb-0"
                                style={{ color: '#f9f9f9', fontWeight: 'bold', fontSize: '2rem' }}
                            >
                                {ticket.title}
                            </h1>
                        </div>
                        <div className="card-body px-5">
                            <div className="text-center mb-4">
                                <h3 className="font-weight-bold text-secondary">
                                    Price: <span className="text-success">${ticket.price}</span>
                                </h3>
                                <h5 className="text-muted">
                                    Seller: <span className="text-primary">{ticket.userId}</span>
                                </h5>
                            </div>
                            {errors && (
                                <div className="alert alert-danger text-center">
                                    {errors}
                                </div>
                            )}
                            <div className="d-flex justify-content-center mt-4">
                                {currentUser?.id === ticket.userId ? (
                                    <button
                                        className="btn btn-lg btn-outline-success btn-block rounded-pill shadow-sm px-5"
                                        onClick={handleEdit}
                                    >
                                        Edit Ticket
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-lg btn-gradient-primary btn-block rounded-pill shadow-sm px-5"
                                        onClick={handlePurchase}
                                    >
                                        Purchase Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-footer text-muted text-center">
                            <small>Secure transaction powered by TikListing</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`)
    return { ticket }
}

export default TicketShow;