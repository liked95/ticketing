import {Publisher, Subjects, ReviewCreatedEvent} from '@sonnytickets/common'

export class ReviewCreatedPublisher extends Publisher<ReviewCreatedEvent> {
    subject: Subjects.ReviewCreated = Subjects.ReviewCreated
}
