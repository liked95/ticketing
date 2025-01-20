import mongoose from 'mongoose'
import {NotFoundError, ReviewCreatedEvent} from '@sonnytickets/common'
import {Ticket} from '../../../models/ticket'
import {ReviewCreatedPublisher} from '../review-created-listenter'
import {natsWrapper} from '../../../nats-wrapper'

const setup = async (hasAtLeastOneReview = false) => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  // Create a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 100,
    userId,
  })

  if (hasAtLeastOneReview) {
    ticket.rating = {
      count: 2,
      average: 4.5,
    }
  }

  await ticket.save()

  // Create an instance of the listener
  const listener = new ReviewCreatedPublisher(natsWrapper.client)

  // Create a fake data object
  const data: ReviewCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticketId: ticket.id,
    rating: 5,
    reviewerId: new mongoose.Types.ObjectId().toHexString(),
    content: 'Great event!',
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {listener, ticket, data, msg}
}

it('creates the first review for a ticket and acknowledges the message', async () => {
  const {listener, ticket, data, msg} = await setup(false)

  // Call the onMessage function
  await listener.onMessage(data, msg)

  // Fetch the updated ticket
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).not.toBeNull()

  // Verify the rating is created
  expect(updatedTicket!.rating).toBeDefined()
  expect(updatedTicket!.rating!.count).toEqual(1) // First review
  expect(updatedTicket!.rating!.average).toEqual(data.rating) // The new rating is the average

  // Verify the message acknowledgment
  expect(msg.ack).toHaveBeenCalled()
})

it('updates the ticket rating correctly and acknowledges the message', async () => {
  const {listener, ticket, data, msg} = await setup(true)

  await listener.onMessage(data, msg)

  // Fetch the updated ticket
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).not.toBeNull()

  // Verify the rating updates
  expect(updatedTicket!.rating?.count).toEqual(3) // Previous count + 1
  expect(updatedTicket!.rating?.average).toEqual(4.67) // Calculated average with new rating

  // Verify the message acknowledgment
  expect(msg.ack).toHaveBeenCalled()
})

it('throws an error if the ticket is not found', async () => {
  const {listener, data, msg} = await setup()

  // Modify data to refer to a non-existent ticket
  data.ticketId = new mongoose.Types.ObjectId().toHexString()

  await expect(listener.onMessage(data, msg)).rejects.toThrow(NotFoundError)

  // Ensure the message was not acknowledged
  expect(msg.ack).not.toHaveBeenCalled()
})
