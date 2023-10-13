/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMemo } from 'react';
import * as d3 from 'd3';
import { useXScale, useYScale } from '../hooks';
import { LinearScale, TimeScale } from '../types';

interface LineOptions<T> {
  data: T[];
  dataKey: keyof T;
}

export function useLineGenerator<T>({ data, dataKey }: LineOptions<T>) {
  const yScale = useYScale({
    data,
    key: (d) => d[dataKey],
  });
  const xScale = useXScale({ data });

  return useMemo(() => {
    return (
      d3
        .line<T>()
        .x((_, i) => xScale(i))
        // @ts-ignore
        .y((d) => yScale(d[dataKey]))
        .curve(d3.curveMonotoneX)
    );
  }, [xScale, yScale]);
}

type LineOpts<T> = {
  yScale: LinearScale<number>;
  xScale: TimeScale;
  xKey: (item: T) => Date;
  yKey: (item: T) => number;
};

export function useLineGeneratorNew<T>({
  xScale,
  yScale,
  xKey,
  yKey,
}: LineOpts<T>) {
  return useMemo(() => {
    return d3
      .line<T>()
      .x((d) => xScale(xKey(d)))
      .y((d) => yScale(yKey(d)))
      .curve(d3.curveMonotoneX);
  }, [xScale, yScale]);
}
