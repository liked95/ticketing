import mongoose from 'mongoose'
import {app} from '../../app'
import request from 'supertest'
import {Ticket} from '../../models/ticket'
import {Order, OrderStatus} from '../../models/order'
import { natsWrapper } from '../../__mocks__/nats-wrapper'



it('return errors if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app).post('/api/orders').set('Cookie', global.signin()).send({ticketId}).expect(404)
})

it('return errors if the ticket has been reserved', async () => {
  const ticket = Ticket.build({title: 'Fireflies', price: 20})
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: 'do you matter',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })

  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({title: 'Fireflies', price: 20})
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({title: 'Fireflies', price: 20})
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
