import express, {Request, Response} from 'express'
import {NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from '@sonnytickets/common'
import {body} from 'express-validator'
import {ReviewUpdatedPublisher} from '../events/publishers/review-updated-publisher'
import {natsWrapper} from '../nats-wrapper'
import {Review} from '../models/review'

const router = express.Router()

router.put(
  '/api/reviews/:id',
  requireAuth,
  [body('ticketId').not().isEmpty().isMongoId().withMessage('ticketId is invalid')],
  [body('rating').isInt({gt: 0, lt: 6}).withMessage('rating must be between 1 and 5')],
  validateRequest,
  async (req: Request, res: Response) => {
    const review = await Review.findOne({_id: req.params.id, ticketId: req.body.ticketId})

    if (!review) {
      throw new NotFoundError()
    }

    if (review.reviewerId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

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
      content: review.content,
      version: review.version,
    })

    res.send(review)
  }
)

export {router as updateReviewRouter}
