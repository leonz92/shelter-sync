import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { userAnimalsSlice } from './slices/userAnimalsSlice';
import { createAuthSlice } from './slices/createAuthSlice';

export const useBoundStore = create(
  immer((...a) => ({
    ...userAnimalsSlice(...a),
    ...createAuthSlice(...a),
  })),
);
