import mongoose from 'mongoose'
import {app} from '../../app'
import request from 'supertest'

it('return errors if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app).post('/api/orders').set('Cookie', global.signin()).send({ticketId}).expect(404)
})

it('return errors if the ticket has been reserved', async () => {})

it('reserves a ticket', async () => {})
