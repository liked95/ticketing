import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@sonnytickets/common";
import { User } from "../models/user";

import { Password } from "../services/password";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email")
      .isEmail()
      .withMessage("Login email must be valid please hix!!!"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password to login"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials!");
    }

    const passwordsMatch = await Password.compare(existingUser.password, password)

    if (!passwordsMatch) {
        throw new BadRequestError("Invalid credentials!");
    }

    const userJWT = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY as string
      );
  
      req.session = {
        jwt: userJWT,
      };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
