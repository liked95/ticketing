import express, {Request, Response} from 'express'
import {Review} from '../models/review'
import {NotFoundError} from '@sonnytickets/common'

const router = express.Router()

router.get('/api/reviews/:id', async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    throw new NotFoundError()
  }

  res.send(review)
})

export {router as showReviewRouter}
