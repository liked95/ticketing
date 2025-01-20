import express, {Request, Response} from 'express'
import {Review} from '../models/review'

// Show all reviews of a ticket
const router = express.Router()

router.get('/api/reviews/all/:ticketId', async (req: Request, res: Response) => {
  const reviews = await Review.find({ticketId: req.params.ticketId})
  res.send(reviews)
})

export {router as showAllReviewsRouter}
