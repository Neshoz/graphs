import { createContext, ReactNode, useContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Context = createContext<any>([]);

export interface ChartProps<T> {
  children: ReactNode;
  data: T[] | undefined;
}

export function Chart<T>({ children, data }: ChartProps<T>) {
  const value = data ?? [];
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useChartContext<T>() {
  return useContext<T>(Context);
}
