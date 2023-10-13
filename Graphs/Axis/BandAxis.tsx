import { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MantineColor, useMantineTheme } from '@mantine/core';
import { useChartContext } from '../Chart';
import { useBandScale } from '../hooks';
import { useResponsiveContainer } from '../ResponsiveContainer';

interface BandAxisProps<T> {
  dataKey: (d: T) => string;
  color?: MantineColor | 'brand';
  strokeWidth?: number;
  tickFormat?: (domainValue: string, index: number) => string;
}

export function BandAxis<T>({
  dataKey,
  color,
  strokeWidth = 2,
  tickFormat,
}: BandAxisProps<T>) {
  const {
    size: { height },
    margin,
  } = useResponsiveContainer();
  const data = useChartContext<T[]>();
  const x = useBandScale({ data, key: dataKey });
  const ref = useRef<SVGGElement>(null);
  const theme = useMantineTheme();
  const colorScheme = color ? theme.colors[color][5] : 'currentColor';

  useLayoutEffect(() => {
    if (ref.current) {
      const axis = d3.axisBottom(x).tickSizeOuter(0);

      if (tickFormat) {
        axis.tickFormat(tickFormat);
      }

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
        .attr('transform', 'rotate(-65)');
    }
  }, [ref.current, data, height, margin]);

  return <g ref={ref} transform={`translate(0, ${height - margin.bottom})`} />;
}
