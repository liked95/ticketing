import request from 'supertest'
import {Ticket} from '../../models/ticket'
import {app} from '../../app'

it('fetch an order', async () => {
  const ticket = Ticket.build({title: 'Fireflies', price: 20})
  await ticket.save()

  const user = global.signin()
  const {body: order} = await request(app)
    .post(`/api/orders/`)
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201)

  await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).expect(200)
})

it('user 1 cannot fetch an order of another user', async () => {
  const ticket = Ticket.build({title: 'Fireflies', price: 20})
  await ticket.save()

  const user1 = global.signin()
  const {body: order} = await request(app)
    .post(`/api/orders/`)
    .set('Cookie', user1)
    .send({ticketId: ticket.id})
    .expect(201)

  const user2 = global.signin()
  await request(app).get(`/api/orders/${order.id}`).set('Cookie', user2).expect(401)
})
