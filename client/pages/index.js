import Link from 'next/link'
import Head from 'next/head'

const LandingPage = ({ currentUser, tickets }) => {
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
        <>
            <Head>
                <title>TikListing</title>
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