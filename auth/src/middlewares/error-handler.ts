import e, { NextFunction, Request, Response } from "express";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map((error: any) => {
      console.log("Signle error", error);
      return { message: error.msg, field: error.path };
    });

    console.log("formattedErrors", formattedErrors);

    res.status(400).send({ errors: formattedErrors });
    return;
  }

  if (err instanceof DatabaseConnectionError) {
    res.status(500).send({ errors: [{ message: err.reason }] });
    return;
  }

  res.status(400).send({ errors: [{ message: "Something went wrong" }] });
};
