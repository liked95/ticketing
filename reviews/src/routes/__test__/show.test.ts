import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'

it('return 401 if the is not', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`/api/reviews/${id}`).send().expect(401)
})

it('return 404 if the review is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`/api/reviews/${id}`).set('Cookie', global.signin()).send().expect(404)
})

it('return the review if the review is found', async () => {
  const rating = 3
  const content = 'Nice performance by the band'
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const user = global.signin()

  const response = await request(app)
    .post('/api/reviews')
    .set('Cookie', user)
    .send({ticketId, rating, content})
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/reviews/${response.body.ticketId}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(ticketResponse.body.rating).toEqual(rating)
  expect(ticketResponse.body.content).toEqual(content)
})
