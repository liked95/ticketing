import {Listener, OrderCreatedEvent, Subjects} from '@sonnytickets/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName: string = this.queueGroupName
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        userId: data.userId,
        version: data.version
    })
    await order.save()

    msg.ack()
  }
}
