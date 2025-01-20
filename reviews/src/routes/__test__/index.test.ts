import request from 'supertest'
import {app} from '../../app'
import {Review} from '../../models/review'
import mongoose from 'mongoose'

it('fetches all reviews for a specific ticket', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString()

  // Create some reviews
  await Review.create([
    {ticketId, rating: 5, content: 'Great!', reviewerId: 'user1'},
    {ticketId, rating: 4, content: 'Good!', reviewerId: 'user2'},
  ])

  const response = await request(app).get(`/api/reviews/${ticketId}`).send().expect(200)

  expect(response.body.length).toEqual(2)
})
