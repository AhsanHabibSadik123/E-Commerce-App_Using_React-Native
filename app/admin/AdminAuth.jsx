// Admin configuration
export const ADMIN_EMAILS = [
  "admin@fashionstore.com",
  "manager@fashionstore.com",
  "supervisor@fashionstore.com",
  // Add more admin emails as needed
];

export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};

export const checkAdminAccess = (userEmail) => {
  if (!userEmail) return false;
  return isAdminEmail(userEmail);
};
