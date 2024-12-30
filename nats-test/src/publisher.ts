import nats from 'node-nats-streaming'
import {TicketCreatedPublisher} from './events/ticket-create-publisher'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

console.log(' go here right')
stan.on('connect', async () => {
  console.log('🎈🎈🎈🎈🎈 Publisher connected to NATS')

  const publisher = new TicketCreatedPublisher(stan)
  await publisher.publish({
    id: '123',
    title: 'Death from above',
    price: 20,
  }).catch(console.error)
})
