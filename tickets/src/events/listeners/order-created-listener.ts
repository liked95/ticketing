import {Listener, OrderCreatedEvent, Subjects} from '@sonnytickets/common'
import {queueGroupName} from './queue-group-name'
import {Message} from 'node-nats-streaming'
import {Ticket} from '../../models/ticket'
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the relevant ticket
    const {
      ticket: {id},
    } = data
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({orderId: data.id})
    
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    await ticket.save()
    msg.ack()
  }
}
