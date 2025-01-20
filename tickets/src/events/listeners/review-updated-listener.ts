import {Listener, NotFoundError, ReviewUpdatedEvent, Subjects} from '@sonnytickets/common'
import {queueGroupName} from './queue-group-name'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../models/ticket'

export class ReviewUpdatedListener extends Listener<ReviewUpdatedEvent> {
  subject: Subjects.ReviewUpdated = Subjects.ReviewUpdated
  queueGroupName = queueGroupName

  async onMessage(data: ReviewUpdatedEvent['data'], msg: Message) {
    const {ratingDifferenceOnUpdate, ticketId} = data

    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    const currentRatingCount = ticket.rating?.count || 0
    const currentRatingAvg = ticket.rating?.average || 0

    if (currentRatingCount === 0) {
      throw new Error('Rating count is zero, cannot update average.')
    }

    // Calculate the new average
    const totalRating = currentRatingAvg * currentRatingCount
    const newTotalRating = totalRating + ratingDifferenceOnUpdate
    const newRatingAvg = parseFloat((newTotalRating / currentRatingCount).toFixed(2))

    // Update the ticket's rating
    await Ticket.findByIdAndUpdate(ticketId, {
      $set: {
        'rating.average': newRatingAvg,
      },
    })

    // Acknowledge the message
    msg.ack()
  }
}
