import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sonnytickets/common'
import express, {Request, Response} from 'express'
import {body} from 'express-validator'
import {Order} from '../models/order'
import mongoose from 'mongoose'
import {stripe} from '../stripe'
import {Payment} from '../models/payment'
import {PaymentCreatedPublisher} from '../events/publishers/payment-created-publisher'
import {natsWrapper} from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('orderId must be a valid ObjectId'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {orderId, token} = req.body
    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError()
    }

    if (req.currentUser?.id !== order.userId) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for order cancelled')
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    })

    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    })
    await payment.save()

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      stripeId: charge.id,
    })

    res.status(201).send({id: payment.id})
  }
)

export {router as createChargeRouter}
