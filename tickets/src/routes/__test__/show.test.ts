import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("return 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/tickets/123/${id}`)
    .send()
    .expect(404);

  console.log(response.body);
});

it("return the ticket if the ticket is found", async () => {
  const title = "Nice gramma";
  const price = 2024;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
