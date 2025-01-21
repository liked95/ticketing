import {TicketStatus} from '@sonnytickets/common'
import mongoose from 'mongoose'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface TicketAttrs {
  title: string
  price: number
  userId: string
  viewCount?: number
  status?: TicketStatus
  rating?: {
    count: number
    average: number
  }
}

interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string
  viewCount?: number
  status?: TicketStatus
  rating?: {
    count: number
    average: number
  }
  createdAt: Date
  updatedAt: Date
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TicketStatus),
      default: TicketStatus.Listed,
    },
    orderId: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    rating: {
      count: {
        type: Number,
        default: 0,
      },
      average: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export {Ticket}
