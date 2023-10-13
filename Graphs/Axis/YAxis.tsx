import { SVGAttributes, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useYScale } from '../hooks';
import { useResponsiveContainer } from '../ResponsiveContainer';
import { useChartContext } from '../Chart';
import { MantineColor, useMantineTheme } from '@mantine/core';

interface YAxisProps extends SVGAttributes<SVGGElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataKey: (d: any) => any;
  position?: 'left' | 'right';
  color?: MantineColor | 'brand';
  strokeWidth?: number;
}

export function YAxis<T>({
  dataKey,
  position = 'left',
  color,
  strokeWidth = 2,
}: YAxisProps) {
  const {
    size: { height, width },
    margin,
  } = useResponsiveContainer();
  const data = useChartContext<T[]>();
  const yScale = useYScale({
    data,
    key: dataKey,
  });
  const ref = useRef<SVGGElement>(null);
  const theme = useMantineTheme();
  const colorScheme = color ? theme.colors[color][5] : 'currentColor';

  const transform =
    position === 'left'
      ? `translate(${margin.left}, 0)`
      : `translate(${width - margin.right}, 0)`;

  useEffect(() => {
    if (ref.current) {
      const axis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);
      d3.select(ref.current)
        .call(axis)
        .select('.domain')
        .style('stroke', colorScheme)
        .style('stroke-width', strokeWidth);

      d3.select(ref.current)
        .selectAll('.tick line')
        .style('stroke', colorScheme)
        .style('stroke-width', strokeWidth);
    }
  }, [ref.current, data, height]);

  return <g ref={ref} transform={transform} orientation={position} />;
}
