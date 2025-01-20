import { useState } from "react"
import useRequest from "../hooks/use-request"
import Router, { useRouter } from "next/router"
import Head from "next/head"
import RatingModal from "../../components/ratingModal"

const TicketShow = ({ ticket, currentUser }) => {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [review, setReview] = useState(null)
    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: (order) => {
            Router.push('/orders/[orderId]', `/orders/${order.id}`)
        }
    })

    const { doRequest: doRequestReview, loading: loadingReview } = useRequest({
        url: `/api/review/${ticket.id}`,
        method: 'get',
        onSuccess: (review) => {
            setReview(review)
            setShowModal(true)
        },
        onError: (error) => {
            if (error?.status === 404) {
                setReview(null)
                setShowModal(true)
            }
        }
    })

    const handlePurchase = () => {
        doRequest()
    }

    const handleEdit = () => {
        Router.push('/tickets/edit/[ticketId]', `/tickets/edit/${ticket.id}`)
    }

    const handleOpenRatingModal = async () => {
        doRequestReview()
    }

    const handleCloseRatingModal = () => {
        setShowModal(false)
    }

    const handleShowAllReviews = () => {
        router.push(`/tickets/${ticket.id}/reviews`)
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
                                <h5 className="text-muted mt-3">
                                    Views:{" "}
                                    <span className="text-info font-weight-bold">
                                        {ticket.viewCount || 0}
                                    </span>
                                </h5>

                                <span className="text-info font-weight-bold" onClick={handleShowAllReviews}>
                                    Ratings:{" "}
                                    ({ticket.rating.average.toFixed(2) || "0.00"} /  {ticket.rating.count || 0})
                                </span>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    className="btn btn-outline-info rounded-pill shadow-sm px-4"
                                    onClick={handleOpenRatingModal}
                                >
                                    {loadingReview ? "Loading..." : "Click to Rate"}
                                </button>
                            </div>


                            {showModal && (
                                <RatingModal
                                    ticketId={ticket.id}
                                    review={review}
                                    onClose={handleCloseRatingModal}
                                />
                            )}

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
    )
}

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`)
    return { ticket }
}

export default TicketShow