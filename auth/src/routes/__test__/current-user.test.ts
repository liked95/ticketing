import request from "supertest";
import { app } from "../../app";

it("Responds with detail about the current user", async () => {
  const cookie = await global.signin();

  if (!cookie) {
    throw new Error("Cookie not set after signup");
  }

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  console.log(response.body);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Responds with null for unauth request", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currnetUser == null).toBe(true);
});
