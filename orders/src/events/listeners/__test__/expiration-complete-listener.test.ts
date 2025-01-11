import {ExpirationCompleteEvent, OrderStatus} from '@sonnytickets/common'
import {natsWrapper} from '../../../nats-wrapper'
import {ExpirationCompleteListener} from '../expiration-complete-listener'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../../models/ticket'
import {Order} from '../../../models/order'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Hello',
    price: 200,
  })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {listener, ticket, order, data, msg}
}

it('update order status to cancelled', async () => {
  const {listener, ticket, order, data, msg} = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit OrderCancelerPublisher event', async () => {
  const {listener, ticket, order, data, msg} = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)
})

it('ack msg', async () => {
  const {listener, ticket, order, data, msg} = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
