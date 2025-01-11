import {ExpirationCompleteEvent, Publisher, Subjects} from '@sonnytickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
