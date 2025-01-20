const ReviewsTable = ({ reviews, ticket }) => {

    if (reviews.length === 0) {
        return (
            <h3 className="mb-4 text-center">
                There are no reviews for the ticket: {ticket.title}
            </h3>
        )
    }

    <h3 className="mb-4 text-center">
        Total reviews for the ticket: {ticket.title}
    </h3>

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Content</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review._id}>
                            <td>{review.content}</td>
                            <td>{review.rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

ReviewsTable.getInitialProps = async (context, client) => {
    const { ticketId } = context.query
    const { data: reviews } = await client.get(`/api/reviews/all/${ticketId}`)
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`)
    return { reviews, ticket }

}

export default ReviewsTable;