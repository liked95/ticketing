import Head from 'next/head';

const OrderIndex = ({ orders }) => {
    return (
        <div className="container mt-5 mw-500">
            <Head>
                <title>Orders</title>
            </Head>
            <h2>Orders</h2>
            
            {orders.length === 0 ? (
                <p>Empty orders</p>
            ) : (
                <table className="table table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.ticket.title}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    return { orders: data };
}

export default OrderIndex;