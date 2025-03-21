import {Message} from 'node-nats-streaming'
import {Subjects, Listener, TicketUpdatedEvent} from '@sonnytickets/common'
import {queueGroupName} from './queue-group-name'
import {Ticket} from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName: string = queueGroupName
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    try {
      const {id, title, price, version} = data
      
      const ticket = await Ticket.findByEvent({id, version})
      if (!ticket) {
        throw new Error('Ticket not found')
      }
  
      ticket.set({title, price})
      await ticket.save()
  
      msg.ack()
    } catch (error) {
      console.error('error updating ', error)
    }
  }
}
