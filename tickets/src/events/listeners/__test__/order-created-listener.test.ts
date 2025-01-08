import {OrderCreatedEvent, OrderStatus} from '@sonnytickets/common'
import {Ticket} from '../../../models/ticket'
import {natsWrapper} from '../../../nats-wrapper'
import {OrderCreatedListener} from '../order-created-listener'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  // creates an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'hello',
    price: 999,
    userId: 'abc',
  })

  await ticket.save()

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'bcd',
    expiresAt: '1234',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, ticket, data, msg}
}

it('set the userId of the ticket', async() => {
    const {listener, ticket, data, msg} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket?.orderId).toEqual(data.id)
})

it('acks successfully', async () => {
    const {listener, ticket, data, msg} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const {listener, ticket, data, msg} = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(ticketUpdatedData.orderId).toEqual(data.id)
})
