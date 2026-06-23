import { useState, useCallback } from 'react';

export interface UseInputLimitReturn {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setValue: (val: string) => void;
  remaining: number;
  isLimitReached: boolean;
  charCount: number;
  maxLength: number;
}

/**
 * Custom hook to limit the number of characters in an input or textarea.
 * Handles direct typing AND copy-paste by slicing the value to maxLength.
 *
 * @param initialValue - The starting value of the input.
 * @param maxLength    - Maximum number of characters allowed.
 */
export function useInputLimit(initialValue: string, maxLength: number): UseInputLimitReturn {
  const [value, setValueRaw] = useState<string>(
    // Protect against an initial value that is already too long
    initialValue.slice(0, maxLength)
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Slice the incoming value to maxLength — this blocks copy-paste overflow too
      const sliced = e.target.value.slice(0, maxLength);
      setValueRaw(sliced);
    },
    [maxLength]
  );

  // Allow external code to set the value (e.g. when a form resets)
  const setValue = useCallback(
    (val: string) => {
      setValueRaw(val.slice(0, maxLength));
    },
    [maxLength]
  );

  const charCount      = value.length;
  const remaining      = maxLength - charCount;
  const isLimitReached = charCount >= maxLength;

  return { value, onChange, setValue, remaining, isLimitReached, charCount, maxLength };
}
