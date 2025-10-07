// constants/responseMessages.js

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

// ---------------------- SUCCESS MESSAGES ----------------------
const SUCCESS_MESSAGES = {
  // USER
  USER_REGISTERED: "User registered successfully.",
  USER_LOGGED_IN: "User logged in successfully.",
  USER_LOGGED_OUT: "User logged out successfully.",
  USER_UPDATED: "User profile updated successfully.",
  USER_DELETED: "User deleted successfully.",

  // STATUS
  STATUS_UPLOADED: "Status uploaded successfully",
  STATUS_DELETED: "Status deleted successfully",
  

  // AUTH / OTP
  OTP_SENT: "OTP sent successfully.",
  OTP_VERIFIED: "OTP verified successfully.",

  // MESSAGES
  MESSAGE_SENT: "Message sent successfully.",
  MESSAGE_UPDATED: "Message updated successfully.",
  MESSAGE_DELETED: "Message deleted successfully.",
  MESSAGE_FORWARDED: "Message forwarded successfully.",
  MESSAGE_REPLIED: "Reply sent successfully.",
  MESSAGE_SEEN: "Message seen status updated.",
  MESSAGE_PINNED: "Message pinned successfully.",
  MESSAGE_UNPINNED: "Message unpinned successfully.",
  MESSAGE_STARRED: "Message starred successfully.",
  MESSAGE_UNSTARRED: "Message unstarred successfully.",
  MESSAGE_REACTION_ADDED: "Reaction added successfully.",
  MESSAGE_REACTION_UPDATED: "Reaction updated successfully.",
  MESSAGE_REACTION_REMOVED: "Reaction removed successfully.",

  // CHANNELS / GROUPS
  CHANNEL_CREATED: "Channel created successfully.",
  CHANNEL_UPDATED: "Channel updated successfully.",
  CHANNEL_DELETED: "Channel deleted successfully.",
  CHANNEL_MEMBER_ADDED: "Member added to channel successfully.",
  CHANNEL_MEMBER_REMOVED: "Member removed from channel successfully.",

  // CHAT
  CHAT_CREATED : "Chat created successfully",
  CHAT_DELETED : "chatch deleted successfully",

  GROUP_CREATED: "Group created successfully.",
  GROUP_UPDATED: "Group updated successfully.",
  GROUP_DELETED: "Group deleted successfully.",
  GROUP_MEMBER_ADDED: "Member added to group successfully.",
  GROUP_MEMBER_REMOVED: "Member removed from group successfully.",

  // FAVORITE / STAR
  ADDED_TO_FAVORITES: "Added to favorites successfully.",
  REMOVED_FROM_FAVORITES: "Removed from favorites successfully.",
  STAR_ADDED: "Star added successfully.",
  STAR_REMOVED: "Star removed successfully.",

  // GENERIC
  REQUEST_SUCCESS: "Request completed successfully.",
  DATA_FETCHED: "Data fetched successfully.",
  ACTION_COMPLETED: "Action completed successfully.",
};

// ---------------------- ERROR MESSAGES ----------------------
const ERROR_MESSAGES = {
  // USER
  USER_NOT_FOUND: "User not found.",
  USER_ALREADY_EXISTS: "User with given details already exists.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  UNAUTHORIZED_ACCESS: "You are not authorized to perform this action.",
  FORBIDDEN_ACTION: "This action is forbidden.",

  // AUTH / OTP
  OTP_EXPIRED: "OTP has expired. Please request again.",
  OTP_INVALID: "Invalid OTP entered.",

  // MESSAGES
  MESSAGE_NOT_FOUND: "Message not found.",
  MESSAGE_SEND_FAILED: "Failed to send message.",
  MESSAGE_UPDATE_FAILED: "Failed to update message.",
  MESSAGE_DELETE_FAILED: "Failed to delete message.",

  // CHANNELS / GROUPS
  CHANNEL_NOT_FOUND: "Channel not found.",
  GROUP_NOT_FOUND: "Group not found.",
  MEMBER_ALREADY_EXISTS: "Member already exists in this channel/group.",
  MEMBER_NOT_FOUND: "Member not found in this channel/group.",

  
  // CHAT
  CHAT_NOT_FOUND : "Chat not found",
  CHAT_ALREADY_EXISTS : "Chat already exists",
  CHAT_OWNER_NOT_FOUND : "Chat owner is not found",
  


  // FAVORITE / STAR
  FAVORITE_NOT_FOUND: "Favorite not found.",
  STAR_NOT_FOUND: "Star not found.",

  // GENERIC
  BAD_REQUEST: "Invalid request data.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again later.",
};

export { STATUS_CODES, SUCCESS_MESSAGES, ERROR_MESSAGES };
