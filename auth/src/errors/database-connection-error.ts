export class DatabaseConnectionError extends Error {
  reason: string = "Error connecting to database the 1";
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
