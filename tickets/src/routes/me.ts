import express, {Request, Response} from 'express'
import {Ticket} from '../models/ticket'
import {requireAuth} from '@sonnytickets/common'

const router = express.Router()

router.get('/api/tickets/me', requireAuth, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({userId: req.currentUser!.id})
  res.status(200).send(tickets)
})

export {router as meTicketRouter}
