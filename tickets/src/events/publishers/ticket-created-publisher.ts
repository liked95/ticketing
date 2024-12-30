import {Publisher, Subjects, TicketCreatedEvent} from '@sonnytickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
