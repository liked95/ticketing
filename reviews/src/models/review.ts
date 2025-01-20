import mongoose from 'mongoose'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface ReviewAttrs {
  ticketId: string
  rating: number
  content?: string
  reviewerId: string
}

interface ReviewDoc extends mongoose.Document {
  ticketId: string
  rating: number
  content?: string
  reviewerId: string
  version: number
}

interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc
}

const reviewSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
    },
    reviewerId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

reviewSchema.set('versionKey', 'version')
reviewSchema.plugin(updateIfCurrentPlugin)

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs)
}

const Review = mongoose.model<ReviewDoc, ReviewModel>('Review', reviewSchema)

export {Review}
