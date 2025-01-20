import request from 'supertest'
import {app} from '../../app'
import mongoose from 'mongoose'
import {natsWrapper} from '../../nats-wrapper'

it('returns 404 if the review for the given ticketId does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/review/${ticketId}`)
    .set('Cookie', global.signin())
    .send({
      rating: 3,
      content: 'Great performance!',
    })
    .expect(404)
})

it('returns 401 if the user is not authenticated', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/review/${ticketId}`)
    .send({
      rating: 3,
      content: 'Great performance!',
    })
    .expect(401)
})

it('returns 401 if the user does not own the review', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const userOneCookie = global.signin()

  // Create a review as user one
  await request(app).post('/api/reviews').set('Cookie', userOneCookie).send({
    rating: 3,
    content: 'Decent performance',
    ticketId,
  })

  // Attempt to update the review as a different user
  const userTwoCookie = global.signin()
  await request(app)
    .put(`/api/review/${ticketId}`)
    .set('Cookie', userTwoCookie)
    .send({
      rating: 4,
      content: 'Really good performance',
    })
    .expect(401)
})

it('returns 400 if the user provides invalid rating or content', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const cookie = global.signin()

  // Create a review
  await request(app).post('/api/reviews').set('Cookie', cookie).send({
    rating: 3,
    content: 'Good event',
    ticketId,
  })

  // Attempt to update with invalid data
  await request(app)
    .put(`/api/review/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      rating: 0, // Invalid rating
      content: '',
    })
    .expect(400)

  await request(app)
    .put(`/api/review/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      rating: 6, // Invalid rating
      content: 'Amazing event!',
    })
    .expect(400)
})

it('returns 200 if the review is successfully updated', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const cookie = global.signin()

  // Create a review
  const response = await request(app).post('/api/reviews').set('Cookie', cookie).send({
    rating: 3,
    content: 'Good performance',
    ticketId,
  })

  // Update the review
  const updatedContent = 'Excellent performance!'
  const updatedRating = 5

  await request(app)
    .put(`/api/review/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      rating: updatedRating,
      content: updatedContent,
    })
    .expect(200)

  // Verify the updated review
  const reviewResponse = await request(app)
    .get(`/api/review/${ticketId}`)
    .set('Cookie', cookie)
    .send()
  expect(reviewResponse.body.rating).toEqual(updatedRating)
  expect(reviewResponse.body.content).toEqual(updatedContent)
})

it('publishes an event after a successful update', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()
  const cookie = global.signin()

  // Create a review
  await request(app).post('/api/reviews').set('Cookie', cookie).send({
    rating: 3,
    content: 'Good performance',
    ticketId,
  })

  // Update the review
  await request(app)
    .put(`/api/review/${ticketId}`)
    .set('Cookie', cookie)
    .send({
      rating: 5,
      content: 'Amazing performance!',
    })
    .expect(200)

  // Ensure the event is published
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
