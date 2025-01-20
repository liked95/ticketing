import {Listener, NotFoundError, ReviewCreatedEvent, Subjects} from '@sonnytickets/common'
import {queueGroupName} from './queue-group-name'
import {Message} from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'

export class ReviewCreatedPublisher extends Listener<ReviewCreatedEvent> {
  subject: Subjects.ReviewCreated = Subjects.ReviewCreated
  queueGroupName = queueGroupName
  async onMessage(data: ReviewCreatedEvent['data'], msg: Message) {
    const {id, rating, reviewerId, ticketId, content} = data
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
        throw new NotFoundError()
    }

    const currentRatingCount = ticket.rating?.count || 0
    const currentRatingAvg = ticket.rating?.average || 0

    const newRatingCount = currentRatingCount + 1
    const newRatingAvg = (currentRatingAvg * currentRatingCount + rating) / newRatingCount

    ticket.rating = {
        count: newRatingCount,
        average: newRatingAvg
    }

    await ticket.save()


  }
}
