import {NotAuthorizedError, NotFoundError, requireAuth} from '@sonnytickets/common'
import express, {Request, Response} from 'express'
import {Order} from '../models/order'

const router = express.Router()

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const id = req.params.orderId
  const order = await Order.findById(id).populate('ticket')

  if (!order)  {
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  } 
  res.send(order)
})

export {router as showOrderRouter}
