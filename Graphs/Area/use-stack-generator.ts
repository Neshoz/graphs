/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMemo } from 'react';
import * as d3 from 'd3';

interface StackOptions<T> {
  data: T[];
  keys: Array<keyof T>;
}

export function useStackGenerator<T>({ data, keys }: StackOptions<T>) {
  return useMemo(() => {
    return d3.stack<T>();
  }, []);
}
