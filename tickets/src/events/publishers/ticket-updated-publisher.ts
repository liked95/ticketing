import {Publisher, Subjects, TicketUpdatedEvent} from '@sonnytickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
