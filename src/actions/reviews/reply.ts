// Reviews Reply Server Action - DISABLED
// Replies are not supported in current schema (no reply/repliedAt/repliedBy columns)
// This feature needs to be added to the database schema first

export const createReply = async () => {
  return { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Reply feature not available' } };
};

export const updateReply = async () => {
  return { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Reply feature not available' } };
};

export const deleteReply = async () => {
  return { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Reply feature not available' } };
};
