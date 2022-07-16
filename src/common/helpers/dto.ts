export type Complete<T> = {
  [P in keyof Required<
    Omit<T, 'createdAt' | 'editedAt' | 'updatedAt' | 'deletedAt' | 'id'>
  >]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};
