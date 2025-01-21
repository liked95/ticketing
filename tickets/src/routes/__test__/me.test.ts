import request from 'supertest'
import {app} from '../../app' // Import the Express app
import {Ticket} from '../../models/ticket'
import mongoose from 'mongoose'

it('returns 401 if user is not authenticated', async () => {
  await request(app).get('/api/tickets/me').send().expect(401)
})

it('returns tickets for the authenticated user', async () => {
  // Create tickets for userOne
  const userOne = global.signin() // Mock authentication for userOne
  await request(app)
    .post('/api/tickets')
    .set('Cookie', userOne)
    .send({title: 'Concert A', price: 50})
    .expect(201)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', userOne)
    .send({title: 'Concert B', price: 100})
    .expect(201)

  // Create a ticket for userTwo
  const userTwo = global.signin() // Mock authentication for userTwo
  await request(app)
    .post('/api/tickets')
    .set('Cookie', userTwo)
    .send({title: 'Concert C', price: 75})
    .expect(201)

  // Fetch tickets for userOne
  const response = await request(app)
    .get('/api/tickets/me')
    .set('Cookie', userOne) // Mock authenticated request
    .send()
    .expect(200)

  // Assert response contains only userOne's tickets
  expect(response.body.length).toEqual(2)
  expect(response.body[0].title).toEqual('Concert A')
  expect(response.body[1].title).toEqual('Concert B')
})
