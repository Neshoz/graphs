import { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import { dateFormatFunctionMap, useTimeScale } from '../hooks';
import { useResponsiveContainer } from '../ResponsiveContainer';
import {
  BaseAxisComponentProps,
  BaseAxisProps,
  TimeDataResolution,
  TimeScale,
} from '../types';
import { useColor } from '../../../hooks';

type WithScale = {
  scale: TimeScale;
  resolution?: TimeDataResolution;
  dataKey?: never;
  extent?: never;
  data?: never;
};

type WithData<T> = {
  data: T[];
  extent?: [Date, Date];
  resolution?: TimeDataResolution;
  scale?: never;
  dataKey: (d: T) => Date;
};

type Props<T> = WithData<T> | WithScale;

type TimeAxisProps<T> = Props<T> &
  BaseAxisComponentProps<T> &
  BaseAxisProps<Date>;

export function TimeAxis<T>({
  data,
  scale,
  extent,
  ticks,
  gridLines,
  rotation = -65,
  tickSizeInner = 1,
  tickSizeOuter = 1,
  strokeWidth = 2,
  resolution = 'day',
  color = 'blue',
  dataKey,
  tickFormat,
}: TimeAxisProps<T>) {
  const {
    size: { height, width },
    margin,
  } = useResponsiveContainer();
  const timeScale = useTimeScale({
    data: data ?? [],
    key: dataKey,
    extent,
  });

  const ref = useRef<SVGGElement>(null);
  const finalScale = scale ?? timeScale;
  const c = useColor(color);
  const colorScheme = color ? c : 'currentColor';
  const dateFormatFunction = dateFormatFunctionMap[resolution];

  useLayoutEffect(() => {
    if (ref.current) {
      const axis = d3
        .axisBottom(finalScale)
        .ticks(ticks)
        .tickSizeInner(tickSizeInner)
        .tickSizeOuter(tickSizeOuter)
        .tickFormat(tickFormat ?? dateFormatFunction);

      d3.select(ref.current)
        .call(axis)
        .select('.domain')
        .style('stroke', colorScheme)
        .style('stroke-width', strokeWidth);

      d3.select(ref.current)
        .selectAll('.tick line')
        .style('stroke', colorScheme)
        .style('stroke-width', strokeWidth);

      d3.select(ref.current)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', `-${margin.left}`)
        .attr('transform', `rotate(${rotation})`);

      d3.select(ref.current).call(axis);

      if (gridLines) {
        d3.select(ref.current)
          .call(axis)
          .selectAll('.tick line')
          .attr('stroke', 'silver')
          .attr('y1', ((width - 2 * axis.tickPadding()) / 2) * -1)
          .attr('y2', ((width - 2 * axis.tickPadding()) / 2) * 1);
      }
    }
  }, [ref.current, data, height, extent, gridLines]);

  return (
    <g
      ref={ref}
      pointerEvents="none"
      transform={`translate(0, ${height - margin.bottom})`}
    />
  );
}
