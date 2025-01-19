import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {natsWrapper} from '../../nats-wrapper'

it('return 404 if the provided review does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/reviews/${id}`)
    .set('Cookie', global.signin())
    .send({
      rating: 3,
      content: 'Nice performance by the band',
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})

it('return 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/reviews/${id}`)
    .send({
      rating: 3,
      content: 'Nice performance by the band',
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(401)
})

it('return 401 if the user does not own review', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const response = await request(app).post('/api/reviews').set('Cookie', global.signin()).send({
    rating: 3,
    content: 'Nice performance by the band',
    ticketId,
  })

  await request(app)
    .put(`/api/reviews/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      rating: 3,
      content: 'Nice performance by the band',
      ticketId,
    })
    .expect(401)
})

it('return 400 user provides invalid rating or content', async () => {
  const cookie = global.signin()

  const response = await request(app).post('/api/reviews').set('Cookie', cookie).send({
    rating: 3,
    content: 'Nice performance by the band',
    ticketId: new mongoose.Types.ObjectId().toHexString(),
  })

  await request(app)
    .put(`/api/reviews/${response.body.id}`)
    .set('Cookie', cookie)
    .send({rating: 0, content: '', ticketId: new mongoose.Types.ObjectId().toHexString()})
    .expect(400)

  await request(app)
    .put(`/api/reviews/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      rating: 8,
      content: 'Nice performance by the band',
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(400)

  await request(app)
    .put(`/api/reviews/${response.body.id}`)
    .set('Cookie', cookie)
    .send({rating: 5, content: 'Nice performance by the band', ticketId: '12345'})
    .expect(400)
})

it('returns 200 if everything is valid', async () => {
  const cookie = global.signin()
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app).post('/api/reviews').set('Cookie', cookie).send({
    rating: 3,
    content: 'Average performance by the band',
    ticketId,
  })

  await request(app)
    .put(`/api/reviews/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      rating: 5,
      content: 'Nice performance by the band',
      ticketId,
    })
    .expect(200)

  const reviewResponse = await request(app).get(`/api/reviews/${response.body.id}`).send()

  expect(reviewResponse.body.rating).toEqual(5)
  expect(reviewResponse.body.content).toEqual('Nice performance by the band')
})

it('publish an events', async () => {
  const cookie = global.signin()
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app).post('/api/reviews').set('Cookie', cookie).send({
    rating: 3,
    content: 'Average performance by the band',
    ticketId,
  })

  await request(app)
    .put(`/api/reviews/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      rating: 5,
      content: 'Nice performance by the band',
      ticketId,
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
