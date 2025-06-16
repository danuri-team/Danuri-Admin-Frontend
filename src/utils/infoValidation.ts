//
export const isValidEmail = (email: string) =>
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(email);

export const isValidPhone = (phone: string) => /^0\d{1,2}-\d{3,4}-\d{4}$/.test(phone);
