import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {Order} from '../../models/order'
import {OrderStatus} from '@sonnytickets/common'
import {stripe} from '../../stripe'
import {Payment} from '../../models/payment'

it('returns 404 for order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({token: '12312312', orderId: new mongoose.Types.ObjectId().toHexString()})
    .expect(404)
})

it('returns 400 invalid orderId', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({token: '12312312', orderId: '2321321312'})
    .expect(400)
})

it('returns 401 for order that does not belong to user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({token: '12312312', orderId: order.id})
    .expect(401)
})

it('returns 404 for purchasing cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: OrderStatus.Cancelled,
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({token: '12312312', orderId: order.id})
    .expect(400)
})

it('return 204 with a valid input', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  const price = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({token: 'tok_visa', orderId: order.id})
    .expect(201)

  const stripeCharges = await stripe.charges.list({limit: 50})
  const stripeCharge = stripeCharges.data.find(c => c.amount === price * 100)

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge?.currency).toEqual('usd')

  const payment = await Payment.findOne({orderId: order.id, stripeId: stripeCharge?.id})
  expect(payment).not.toBeNull()
})
