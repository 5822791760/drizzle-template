export class DbQueryError extends Error {
  constructor(err: Error) {
    super(err.message);
  }
}
