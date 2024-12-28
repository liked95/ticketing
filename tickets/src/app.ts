import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@sonnytickets/common";
import { createTicketRouter } from "./routes/new";
import { getCurrentUser } from '@sonnytickets/common';

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(getCurrentUser)
app.use(createTicketRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
