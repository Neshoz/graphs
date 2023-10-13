import { MantineColor } from '@mantine/core';
import { NumberValue } from 'd3';
import { useXScale, useYScale } from '../hooks';
import { CircleType } from './types';
import { Circle } from '../Circle';

interface Props<T> {
  color?: MantineColor | 'brand';
  data: T[];
  dataKey: keyof T;
  circle: CircleType<T>;
}

export function LineCircles<T>({ data, dataKey, circle, color }: Props<T>) {
  const x = useXScale({ data });
  const y = useYScale({ data, key: (d) => d[dataKey] });

  return (
    <>
      {data.map((d, i) => {
        const cx = x(i);
        const cy = y(d[dataKey] as NumberValue);

        return typeof circle === 'boolean' ? (
          <Circle x={cx} y={cy} color={color} />
        ) : (
          circle(d, { x: cx, y: cy })
        );
      })}
    </>
  );
}
