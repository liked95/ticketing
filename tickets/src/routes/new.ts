import { requireAuth } from "@sonnytickets/common";
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  res.send({ message: "Ticket created" });
});

export { router as createTicketRouter };
