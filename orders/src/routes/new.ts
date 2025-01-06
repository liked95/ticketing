import {BadRequestError, NotFoundError, requireAuth, validateRequest} from '@sonnytickets/common'
import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import mongoose from 'mongoose'
import {Ticket} from '../models/ticket'
import {Order, OrderStatus} from '../models/order'
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const EXPIRATION_WINDOW_SECONDS = 15 * 60
const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body

    // Find the ticket
    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
      throw new NotFoundError()
    }

    // Make sure the ticket is not reserved
    // Find order that has the above ticket with status !== cancelled
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // Calculate the expiration date for the order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })

    await order.save()
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(), 
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    })

    // Publish event telling order was created
    res.status(201).send(order)
  }
)

export {router as newOrderRouter}
