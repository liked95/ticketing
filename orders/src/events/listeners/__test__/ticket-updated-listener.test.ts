import {natsWrapper} from '../../../nats-wrapper'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../../models/ticket'
import {TicketUpdatedListener} from '../ticket-updated-listener'
import {TicketUpdatedEvent} from '@sonnytickets/common'

const setup = async () => {
  // creates an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'hello pagefly',
    price: 20,
  })

  await ticket.save()

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'updated title',
    price: 50,
    userId: 'ahaha',
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {listener, data, msg, ticket}
}
it('finds, updates, and saves ticket', async () => {
  // call the onMessage function with the data object + message object
  const {listener, data, msg, ticket} = await setup()

  // write assertions to make sure the ticket was created
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(data.id)

  expect(updatedTicket).toBeDefined()
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  // call the onMessage function with the data object + message object
  const {listener, data, msg} = await setup()

  // write assertions to make sure ack is called
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if event has a skipped version number', async () => {
  const {listener, data, msg, ticket} = await setup()
  data.version = 3

  try {
    await listener.onMessage(data, msg)
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled()
})
