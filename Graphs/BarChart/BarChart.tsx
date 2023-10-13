// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MantineColor } from '@mantine/core';
import { Fragment, ReactNode } from 'react';
import { Bar } from '../Bar';
import { useBandScale, useLinearScale } from '../hooks';
import { useResponsiveContainer } from '../ResponsiveContainer';
import { Surface } from '../Surface';

interface Props<T> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  color?: MantineColor | 'brand';
  variant?: 'filled' | 'outline';
  label?: (item: T) => ReactNode;
  xAxis?: ReactNode;
  yAxis?: ReactNode;
}

export function BarChart<T>({
  data,
  xKey,
  yKey,
  label,
  xAxis,
  yAxis,
  color = 'blue',
  variant = 'filled',
}: Props<T>) {
  const {
    size: { height },
    margin,
  } = useResponsiveContainer();
  const x = useBandScale({ data, key: (d) => d[xKey] });
  const y = useLinearScale({ data, key: (d) => d[yKey] });

  const barHeight = height - margin.bottom;

  return (
    <Surface>
      {data.map((e, i) => (
        <Fragment key={i}>
          <Bar
            width={x.bandwidth()}
            height={barHeight - y(e[yKey])}
            x={x(e[xKey])}
            y={y(e[yKey])}
            color={color}
            variant={variant}
          />
          {label && (
            <text
              fill="white"
              x={x(e[xKey]) + x.bandwidth() / 2}
              y={y(e[yKey])}
            >
              {label(e)}
            </text>
          )}
        </Fragment>
      ))}
      {xAxis}
      {yAxis}
    </Surface>
  );
}
