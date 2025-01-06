import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@sonnytickets/common";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        
    }

}