import express from "express";
import { getCurrentUser } from "@sonnytickets/common";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  getCurrentUser,
  (req, res) => {
    res.send({ currentUser: req.currentUser });
  }
);

export { router as currentUserRouter };
