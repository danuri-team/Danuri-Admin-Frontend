import { useReducer, useCallback } from "react";

type FormAction<T> =
  | { type: "CHANGE"; payload: { key: keyof T; value: T[keyof T] } }
  | { type: "CHANGE_MULTIPLE"; payload: Partial<T> }
  | { type: "RESET" }
  | { type: "RESET_FIELD"; payload: keyof T };

interface UseFormReducerOptions<T> {
  validators?: Partial<Record<keyof T, (value: T[keyof T]) => boolean>>;
  formatters?: Partial<Record<keyof T, (value: string) => string>>;
  onChange?: (state: T) => void;
}

export function useFormReducer<T extends Record<string, any>>(
  initialState: T,
  options: UseFormReducerOptions<T> = {}
) {
  const {
    validators = {} as Partial<Record<keyof T, (value: T[keyof T]) => boolean>>,
    formatters = {} as Partial<Record<keyof T, (value: string) => string>>,
    onChange,
  } = options;

  // 리듀서 정의
  const reducer = (state: T, action: FormAction<T>): T => {
    switch (action.type) {
      case "CHANGE": {
        const { key, value } = action.payload;
        let processedValue = value;

        // 포맷터 적용
        const formatter = formatters[key as keyof T];
        if (formatter && typeof value === "string") {
          processedValue = formatter(value as string) as T[keyof T];
        }

        // 유효성 검사 (선택적)
        const validator = validators[key as keyof T];
        if (validator && !validator(processedValue)) {
          return state; // 유효하지 않으면 상태 변경 안함
        }

        const newState = {
          ...state,
          [key]: processedValue,
        };

        onChange?.(newState);
        return newState;
      }

      case "CHANGE_MULTIPLE": {
        const newState = {
          ...state,
          ...action.payload,
        };
        onChange?.(newState);
        return newState;
      }

      case "RESET": {
        onChange?.(initialState);
        return initialState;
      }

      case "RESET_FIELD": {
        const newState = {
          ...state,
          [action.payload]: initialState[action.payload],
        };
        onChange?.(newState);
        return newState;
      }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // 헬퍼 함수들
  const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    dispatch({ type: "CHANGE", payload: { key, value } });
  }, []);

  const updateMultipleFields = useCallback((fields: Partial<T>) => {
    dispatch({ type: "CHANGE_MULTIPLE", payload: fields });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const resetField = useCallback((key: keyof T) => {
    dispatch({ type: "RESET_FIELD", payload: key });
  }, []);

  const isValid = useCallback(() => {
    // 모든 필수 필드가 채워져 있는지 확인
    const hasEmptyFields = Object.values(state).some(
      (value) => value === "" || value === null || value === undefined
    );

    if (hasEmptyFields) return false;

    // 모든 검증 함수 통과 확인
    for (const [key, validator] of Object.entries(validators)) {
      const typedValidator = validator as (value: T[keyof T]) => boolean;
      if (!typedValidator(state[key as keyof T])) {
        return false;
      }
    }

    return true;
  }, [state, validators]);

  const getFieldError = useCallback(
    (key: keyof T): string | null => {
      const value = state[key];
      const validator = validators[key as keyof T];

      if (!validator) return null;

      if (value && !validator(value)) {
        return `${String(key)} 형식이 올바르지 않습니다.`;
      }

      return null;
    },
    [state, validators]
  );

  const formHelpers = {
    updateField,
    updateMultipleFields,
    reset,
    resetField,
    isValid,
    getFieldError,
  };

  return [state, dispatch, formHelpers] as const;
}

// 일반적인 폼 리듀서 (백워드 호환성)
export function createFormReducer<T extends Record<string, any>>(
  initialState: T,
  customHandlers?: {
    formatters?: Partial<Record<keyof T, (value: string) => string>>;
  }
) {
  return (state: T, action: FormAction<T>): T => {
    switch (action.type) {
      case "CHANGE": {
        const { key, value } = action.payload;
        let processedValue = value;

        // 포맷터 적용
        if (customHandlers?.formatters?.[key] && typeof value === "string") {
          processedValue = customHandlers.formatters[key](value as string) as T[keyof T];
        }

        return {
          ...state,
          [key]: processedValue,
        };
      }

      case "RESET":
        return initialState;

      default:
        return state;
    }
  };
}
