import mongoose from 'mongoose'
import {NotFoundError, ReviewUpdatedEvent} from '@sonnytickets/common'
import {Ticket} from '../../../models/ticket'
import {ReviewUpdatedListener} from '../review-updated-listener'
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
  const listener = new ReviewUpdatedListener(natsWrapper.client)

  // Create a fake data object
  const data: ReviewUpdatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticketId: ticket.id,
    rating: 4, // Updated rating
    ratingDifferenceOnUpdate: -1, // Difference between old and new rating
    reviewerId: new mongoose.Types.ObjectId().toHexString(),
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return {listener, ticket, data, msg}
}

it('updates the ticket rating correctly when a review is updated', async () => {
  const {listener, ticket, data, msg} = await setup(true)

  // Call the onMessage function
  await listener.onMessage(data, msg)

  // Fetch the updated ticket
  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).not.toBeNull()

  // Verify the rating updates
  expect(updatedTicket!.rating?.count).toEqual(2) // Count remains unchanged
  expect(updatedTicket!.rating?.average).toEqual(4.0) // Adjusted average (4.5 * 2 - 1) / 2 = 4.0

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

it('throws an error if the ticket has no ratings', async () => {
  const {listener, ticket, data, msg} = await setup(false)

  // Ensure the ticket has no ratings
  ticket.rating = undefined
  await ticket.save()

  await expect(listener.onMessage(data, msg)).rejects.toThrow()

  // Ensure the message was not acknowledged
  expect(msg.ack).not.toHaveBeenCalled()
})
