import { useCallback, useState } from "react";

export function useFocus(initialValue: boolean = false) {
  const [isFocused, setIsFocused] = useState(initialValue);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    isFocused,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
}
