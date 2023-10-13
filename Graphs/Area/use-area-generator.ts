/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMemo } from 'react';
import * as d3 from 'd3';
import { useXScale, useYScale } from '../hooks';

interface AreaOptions<T> {
  data: T[];
  dataKey: keyof T;
}

export function useAreaGenerator<T>({ data, dataKey }: AreaOptions<T>) {
  const yScale = useYScale({
    data,
    key: (d) => d[dataKey],
  });
  const xScale = useXScale({ data });

  return useMemo(() => {
    return (
      d3
        .area<T>()
        .x((_, i) => xScale(i))
        // @ts-ignore
        .y1((d) => yScale(d[dataKey]))
        .y0(yScale(0))
        .curve(d3.curveMonotoneX)
    );
  }, [yScale, xScale]);
}
