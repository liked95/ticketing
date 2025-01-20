import { Publisher, ReviewUpdatedEvent, Subjects } from '@sonnytickets/common'

export class ReviewUpdatedPublisher extends Publisher<ReviewUpdatedEvent> {
    subject: Subjects.ReviewUpdated = Subjects.ReviewUpdated
}
