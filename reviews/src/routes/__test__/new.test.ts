import request from 'supertest'
import {app} from '../../app'
import {Review} from '../../models/review'
import {natsWrapper} from '../../nats-wrapper'
import mongoose from 'mongoose'

it('has a route handler listening to /api/reviews for post requests', async () => {
  const response = await request(app).post('/api/reviews').send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/reviews').send({}).expect(401)
})

it('return status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/reviews').set('Cookie', global.signin()).send({})

  expect(response.status).not.toEqual(401)
})

it('return errors if invalid rating is provided', async () => {
  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId: new mongoose.Types.ObjectId().toHexString(), rating: 6})
    .expect(400)

  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId: new mongoose.Types.ObjectId().toHexString(), rating: 0})
    .expect(400)

  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId: new mongoose.Types.ObjectId().toHexString(), rating: 'abc'})
    .expect(400)
})

it('return error if invalid ticketId is provided', async () => {
  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId: 'sdafsd', rating: 3})
    .expect(400)

  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId: 123445513213, rating: 3})
    .expect(400)
})

it('creates a ticket with valid input', async () => {
  let reviews = await Review.find({})
  expect(reviews.length).toEqual(0)

  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({
      ticketId: new mongoose.Types.ObjectId().toHexString(),
      rating: 3,
      content: 'Nice performance by the band',
    })
    .expect(201)

  reviews = await Review.find({})
  expect(reviews.length).toEqual(1)
  expect(reviews[0].rating).toEqual(3)
  expect(reviews[0].content).toEqual('Nice performance by the band')
})

it('publishes an event', async () => {
  await request(app)
    .post('/api/reviews')
    .set('Cookie', global.signin())
    .send({ticketId: new mongoose.Types.ObjectId().toHexString(), rating: 3, content: 'Nice performance by the band'})
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
