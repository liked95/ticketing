import { requireAuth, validateRequest } from "@sonnytickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Review } from "../models/review";
import { ReviewCreatedPublisher } from "../events/publishers/review-created-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();

router.post(
  "/api/reviews",
  requireAuth,
  [body("ticketId").not().isEmpty().isMongoId().withMessage("ticketId is required")],
  [
    body("rating")
      .isInt({ gt: 0, lt: 6 })
      .withMessage("rating must be between 1 and 5"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId, rating, content } = req.body;

    const review = Review.build({ ticketId, rating, content, reviewerId: req.currentUser!.id });
    await review.save()

    await new ReviewCreatedPublisher(natsWrapper.client).publish({
      id: review.id,
      ticketId: review.ticketId,
      reviewerId: review.reviewerId,
      rating: review.rating,
      content: review.content,
      version: review.version
    })

    res.status(201).send(review);
  }
);

export { router as createReviewRouter };
