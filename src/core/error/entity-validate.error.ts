export class EntityValidationError extends Error {
  constructor(message = 'entity validation fail') {
    super(message);
  }
}
