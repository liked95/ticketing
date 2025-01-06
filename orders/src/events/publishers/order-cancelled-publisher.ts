import {OrderCancelledEvent, Publisher, Subjects} from '@sonnytickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
