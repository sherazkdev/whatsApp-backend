
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  USER_ALREADY_EXISTS: "User with given details already exists.",
  OTP_EXPIRED: "OTP has expired. Please request again.",
  OTP_INVALID: "Invalid OTP entered.",
  UNAUTHORIZED_ACCESS: "You are not authorized to perform this action.",
  FORBIDDEN_ACTION: "This action is forbidden.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
  BAD_REQUEST: "Invalid request data.",
};

export { STATUS_CODES, ERROR_MESSAGES };
