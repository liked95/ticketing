import nats from 'node-nats-streaming';

console.clear()

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

console.log(' go here right')
stan.on('connect', () => {
    console.log('🎈🎈🎈🎈🎈 Publisher connected to NATS')
    const data = JSON.stringify({
        id: '123',
        title: '1 change from publisher',
        price: 20
    })

    stan.publish('ticket:created', data, () => {
        console.log('Event published for data: ', data)
    })
})

