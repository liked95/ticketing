import Router from 'next/router';
import Head from "next/head";
import useRequest from '../../hooks/use-request';
import { useState } from 'react';

const TicketEdit = ({ ticket, currentUser }) => {
    const [title, setTitle] = useState(ticket.title);
    const [price, setPrice] = useState(ticket.price);
    const { doRequest, errors } = useRequest({
        url: `/api/tickets/${ticket.id}`,
        method: 'put',
        body: { title, price },
        onSuccess: () => Router.push(`/tickets/${ticket.id}`),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await doRequest();
    };

    return (
        <div className="container mt-5">
            <Head>
                <title>Edit Ticket: {ticket.title}</title>
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
                                Edit Ticket
                            </h1>
                        </div>
                        <div className="card-body px-5">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="title" className="font-weight-bold">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="form-control rounded-pill shadow-sm"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="price" className="font-weight-bold">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        className="form-control rounded-pill shadow-sm"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        min="0"
                                        step="1"
                                        required
                                    />
                                </div>
                                {errors && (
                                    <div className="alert alert-danger text-center mt-3">
                                        {errors}
                                    </div>
                                )}
                                <div className="d-flex justify-content-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-lg btn-outline-success btn-block rounded-pill shadow-sm px-5"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TicketEdit.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket };
};

export default TicketEdit;