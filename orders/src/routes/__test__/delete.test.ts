import request from 'supertest'
import {app} from '../../app'
import {Ticket} from '../../models/ticket'
import {OrderStatus} from '@sonnytickets/common'
import {natsWrapper} from '../../nats-wrapper'
import mongoose from 'mongoose'

it('marks on order as cancelled', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Fireflies',
    price: 20,
  })
  await ticket.save()

  const user = global.signin()
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).expect(204)

  const {body} = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).expect(200)

  expect(body.order.status).toEqual(OrderStatus.Cancelled)
})

it('not allow user1 to cancel order of another user', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Fireflies',
    price: 20,
  })
  await ticket.save()

  const user1 = global.signin()
  const user2 = global.signin()
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ticketId: ticket.id})
    .expect(201)

  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user2).expect(401)

  const {body} = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user1).expect(200)

  expect(body.order.status).toEqual(OrderStatus.Created)
})

it('emits an order cancelled event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Fireflies',
    price: 20,
  })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
