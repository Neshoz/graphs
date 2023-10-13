// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SVGAttributes, useRef } from 'react';
import { MantineColor } from '@mantine/core';
import { LegendItem } from './LegendItem';
import { useResponsiveContainer } from '../ResponsiveContainer';

interface Props<T> extends SVGAttributes<SVGGElement> {
  position?: 'left' | 'right';
  color?: MantineColor | 'brand';
  dataKeys: Array<keyof T>;
  colors: (key: keyof T) => string;
  variant?: 'filled' | 'outline';
  size?: number;
  margin?: number;
  spacing?: number;
}

export function Legend<T>({
  position = 'right',
  dataKeys,
  colors,
  variant = 'filled',
  size = 20,
  margin: legendMargin = 10,
  spacing = 5,
}: Props<T>) {
  const {
    margin,
    size: { width },
  } = useResponsiveContainer();
  const ref = useRef<SVGGElement>(null);

  const transform =
    position === 'left'
      ? `translate(${margin.left}, 0)`
      : `translate(${width - margin.right}, 0)`;

  return (
    <g ref={ref} transform={transform} role="img">
      {dataKeys.map((key, index) => {
        return (
          <LegendItem
            x={0}
            y={index * (size + spacing)}
            title={key as string}
            color={colors(key)}
            key={index}
            variant={variant}
            size={size}
            margin={legendMargin}
          />
        );
      })}
    </g>
  );
}
