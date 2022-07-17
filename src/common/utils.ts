export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export const toBoolean = (value?: string | number): boolean => {
  return value === 'true' || value === '1' || value === 1 || value === '';
};
