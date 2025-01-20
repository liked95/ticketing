import express, {Request, Response} from 'express'
import {Ticket} from '../models/ticket'
import {NotFoundError} from '@sonnytickets/common'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    throw new NotFoundError()
  }

  const updatedViewCount = ticket.viewCount ? ticket.viewCount + 1 : 1
  const updateTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    {
      viewCount: updatedViewCount,
    },
    {new: true}
  )

  res.send(updateTicket)
})

export {router as showTicketRouter}
