import { OrderCancelledEvent, OrderStatus } from '@sonnytickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: '123',
    version: 0,
  })

  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'abcd',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {listener, data, msg, order}
}

it('update the status of order', async () => {
  const {listener, data, msg, order} = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(data.id)
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('acks the msg', async () => {
  const {listener, data, msg, order} = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
