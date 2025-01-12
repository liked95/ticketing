import { PaymentCreatedEvent, Publisher, Subjects } from "@sonnytickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}