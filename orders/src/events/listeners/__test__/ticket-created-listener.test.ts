import {TicketCreatedEvent} from '@sonnytickets/common'
import {natsWrapper} from '../../../nats-wrapper'
import {TicketCreatedListener} from '../ticket-created-listener'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../../models/ticket'

const setup = async () => {
  // creates an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {listener, data, msg}
}
it('creates an saves a ticket', async () => {
  // call the onMessage function with the data object + message object
  const {listener, data, msg} = await setup()

  // write assertions to make sure the ticket was created
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  // call the onMessage function with the data object + message object
  const {listener, data, msg} = await setup()

  // write assertions to make sure ack is called
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
