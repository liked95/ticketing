import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {Review} from '../../models/review'

it('return 404 if the review is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`/api/reviews/${id}`).send().expect(404)
})

it('return the review if the review is found', async () => {
  const rating = 3
  const content = 'Nice performance by the band'
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId, rating, content})
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/reviews/${response.body.id}`)
    .send()
    .expect(200)

  expect(ticketResponse.body.rating).toEqual(rating)
  expect(ticketResponse.body.content).toEqual(content)
})
