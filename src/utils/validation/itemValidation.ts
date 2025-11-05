export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateItemQuantities = (
  totalQuantity: string | number,
  availableQuantity: string | number
): ValidationResult => {
  const total = Number(totalQuantity);
  const available = Number(availableQuantity);

  if (isNaN(total) || isNaN(available)) {
    return {
      valid: false,
      error: "수량은 숫자여야 합니다.",
    };
  }

  if (total < 0 || available < 0) {
    return {
      valid: false,
      error: "수량은 0 이상이어야 합니다.",
    };
  }

  if (available > total) {
    return {
      valid: false,
      error: "사용 가능한 수량이 총 수량을 초과할 수 없습니다.",
    };
  }

  return { valid: true };
};
