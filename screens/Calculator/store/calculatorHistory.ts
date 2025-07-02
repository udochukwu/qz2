import { create } from 'zustand';
import { UnitCategory } from '../types';

export type History = {
    equation: string;
    result: string;
    type: "calc" | "converter",
    unitCategory?: UnitCategory
}

interface StoreState {
  history: History[];
    addToHistory: (value: History) => void
    clearHistory: () => void;
  }

export const useCalculatorHistoryStore = create<StoreState>((set) => ({
  history: [],
   addToHistory: (value: History) => set((state) => ({
    history: [value, ...state.history]
   }) ),
   clearHistory: () => set({history: []})
  }));
