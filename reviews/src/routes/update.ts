import express, {Request, Response} from 'express'
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from '@sonnytickets/common'
import {body} from 'express-validator'
import {ReviewUpdatedPublisher} from '../events/publishers/review-updated-publisher'
import {natsWrapper} from '../nats-wrapper'
import {Review} from '../models/review'

const router = express.Router()

router.put(
  '/api/reviews/:ticketId',
  requireAuth,
  [body('rating').isInt({gt: 0, lt: 6}).withMessage('rating must be between 1 and 5')],
  validateRequest,
  async (req: Request, res: Response) => {
    const review = await Review.findOne({
      ticketId: req.params.ticketId,
      reviewerId: req.currentUser!.id,
    })

    if (!review) {
      throw new NotFoundError()
    }

    console.log({review, userId: req.currentUser!.id})
    const oldRating = review.rating

    review.set({
      rating: req.body.rating,
      content: req.body.content,
    })

    await review.save()

    await new ReviewUpdatedPublisher(natsWrapper.client).publish({
      id: review.id,
      ticketId: review.ticketId,
      reviewerId: review.reviewerId,
      rating: review.rating,
      ratingDifferenceOnUpdate: review.rating - oldRating,
      content: review.content,
    })

    res.send(review)
  }
)

export {router as updateReviewRouter}
