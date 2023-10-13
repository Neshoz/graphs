import { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useColor } from '../../../hooks';
import { useResponsiveContainer } from '../ResponsiveContainer';
import { BaseAxisProps, LinearScale } from '../types';
import { NumberValue } from 'd3';

type Props<T> = {
  scale: LinearScale<T>;
};
type LinearAxisProps<T> = BaseAxisProps<NumberValue> & Props<T>;

export function LinearAxis<T>({
  scale,
  rotation = -65,
  strokeWidth = 2,
  tickSizeInner = 1,
  tickSizeOuter = 1,
  ticks,
  color = 'blue',
  tickFormat = (value) => String(value),
}: LinearAxisProps<T>) {
  const { margin } = useResponsiveContainer();
  const ref = useRef<SVGGElement>(null);
  const colorScheme = useColor(color);

  useLayoutEffect(() => {
    if (ref.current) {
      const axis = d3
        .axisLeft(scale)
        .ticks(ticks)
        .tickSizeInner(tickSizeInner)
        .tickSizeOuter(tickSizeOuter)
        .tickFormat(tickFormat);

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
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', `rotate(${rotation})`);

      d3.select(ref.current).call(axis);
    }
  }, [ref.current, scale]);

  return (
    <g
      ref={ref}
      pointerEvents="none"
      transform={`translate(${margin.left}, 0)`}
    />
  );
}
