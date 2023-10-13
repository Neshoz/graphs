import * as d3 from 'd3';
import { MantineColor } from '@mantine/core';
import { ReactNode } from 'react';

export type TimeScale = Date[] & d3.ScaleTime<number, number>;
export type LinearScale<T> = T[] & d3.ScaleLinear<number, number>;
export type ObjectWithTime = { time: string };

type BaseScaleOptions<T, K> = {
  data: T[];
  key?: (item: T) => K;
};

export type BaseAxisProps<T> = {
  ticks?: number;
  tickSizeInner?: number;
  tickSizeOuter?: number;
  rotation?: number;
  strokeWidth?: number;
  tickFormat?: (value: T) => string;
  color?: MantineColor;
};

export type BaseAxisComponentProps<T> = {
  data?: T[];
  gridLines?: boolean;
} & BaseAxisProps<T>;

export type BaseChartComponentProps<T, XScale = unknown, YScale = unknown> = {
  data: T[];
  xKey: (item: T) => Date;
  yKey: (item: T) => number;
  xAxis?: (scale: XScale) => ReactNode;
  yAxis?: (scale: YScale) => ReactNode;
};

export type TimeScaleOptions<T> = {
  extent?: [Date, Date];
} & BaseScaleOptions<T, Date>;

export type LinearScaleOptions<T> = {
  direction?: 'horizontal' | 'vertical';
} & BaseScaleOptions<T, number>;

export type TimeDataResolution = 'day' | 'hour' | 'minute';
