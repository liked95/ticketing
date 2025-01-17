import Link from 'next/link'
import Head from 'next/head'

const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => (
        <tr key={ticket.id}>
            <td>
                {ticket.title}{' '}
                {currentUser && currentUser.id === ticket.userId && (
                    <i className="fas fa-user-circle" style={{ color: 'blue', marginLeft: '8px' }} title="Your Ticket"></i>
                )}
            </td>
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
        <>
            <Head>
                <title>TikListing</title>
                {/* Include Font Awesome */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                />
            </Head>
            <h2>Tickets</h2>
            <table className="table table-striped table-responsive">
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
        </>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default LandingPage