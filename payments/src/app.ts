import { errorHandler, getCurrentUser, NotFoundError } from "@sonnytickets/common";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import morgan from 'morgan';
import { createChargeRouter } from "./routes/new";


const app = express();

app.set("trust proxy", true);
app.use(morgan('dev'))

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);

app.use(getCurrentUser)
app.use(createChargeRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

// @ts-ignore
app.use(errorHandler);

export { app };

