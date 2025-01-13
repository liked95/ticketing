import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
    console.log("🚀 ~ LandingPage ~ tickets:", tickets)
    const ticketList = tickets.map(ticket => (
        <tr key={ticket.id}>
            <td>{ticket.title}</td>
            <td>{ticket.price}</td>
            <td>
                {ticket.orderId ? (
                    <span style={{ color: 'grey', cursor: 'not-allowed' }}>Ordered</span>
                ) : (
                    <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
                        View
                    </Link>
                )}
            </td>
        </tr>
    ))
    return (
        <div style={{ paddingLeft: '200px', paddingRight: '200px' }}>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default LandingPage