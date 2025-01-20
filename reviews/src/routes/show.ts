import express, {Request, Response} from 'express'
import {Review} from '../models/review'
import {NotFoundError, requireAuth} from '@sonnytickets/common'

const router = express.Router()

router.get('/api/reviews/:ticketId', requireAuth, async (req: Request, res: Response) => {
  const review = await Review.findOne({
    ticketId: req.params.ticketId,
    reviewerId: req.currentUser?.id,
  })

  if (!review) {
    throw new NotFoundError()
  }

  res.send(review)
})

export {router as showReviewRouter}
