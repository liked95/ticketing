import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@sonnytickets/common";
import { createTicketRouter } from "./routes/new";
import { getCurrentUser } from '@sonnytickets/common';
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
import { meTicketRouter } from "./routes/me";
import morgan from 'morgan'


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
app.use(createTicketRouter)
app.use(meTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError();
});

// @ts-ignore
app.use(errorHandler);

export { app };
