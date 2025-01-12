import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (userId ?: string) => string[];
}
jest.mock("../nats-wrapper");

process.env.STRIPE_KEY = 'sk_test_51QgJbQAJByBViNj79zmRPuVXFQEftBaDEPYi1BQMxfupixDly01bdk0JUA2j9lnyvzo4iFbiHK4p3cdH5DnDfJV500s2cGcJ9y'

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "abcd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = (await mongoose.connection.db?.collections()) || [];

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (userId?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: userId || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
