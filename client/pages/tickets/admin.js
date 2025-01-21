import Link from 'next/link';

const TicketAdmin = ({ tickets }) => {
    return (
        <div className='container my-5'>
            <div className='card shadow-lg'>
                {/* Header */}
                <div className='card-header text-center bg-primary text-white'>
                    <h2 className='fw-bold text-uppercase'>Ticket Management</h2>
                </div>

                {/* Table */}
                <div className='card-body'>
                    <div className='table-responsive'>
                        <table className='table table-hover table-striped align-middle'>
                            <thead className='table-dark text-center'>
                                <tr>
                                    <th scope='col'>Time Created</th>
                                    <th scope='col'>Title</th>
                                    <th scope='col'>Price</th>
                                    <th scope='col'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className='text-center'>
                                        <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                        <td className='fw-bold'>{ticket.title}</td>
                                        <td className='text-success fw-bold'>
                                            ${ticket.price.toFixed(2)}
                                        </td>
                                        <td>
                                            <Link
                                                href={`/tickets/edit/${ticket.id}`}
                                                className='btn btn-sm btn-primary'
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

TicketAdmin.getInitialProps = async (context, client) => {
    const { data: tickets } = await client.get(`/api/tickets/me`);
    return { tickets };
};

export default TicketAdmin;