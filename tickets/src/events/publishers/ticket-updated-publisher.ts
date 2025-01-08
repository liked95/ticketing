import {Publisher, Subjects, TicketUpdatedEvent} from '@sonnytickets/common'
import { natsWrapper } from '../../nats-wrapper'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}

// new TicketUpdatedPublisher(natsWrapper.client).publish({
    
// })