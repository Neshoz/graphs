import { ReactNode } from 'react';

export interface Point {
  x: number;
  y: number;
}

export type CircleType<T> = boolean | ((data: T, position: Point) => ReactNode);
