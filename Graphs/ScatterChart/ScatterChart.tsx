import * as d3 from 'd3';
import { MantineColor, Tooltip } from '@mantine/core';
import { ReactNode } from 'react';
import { Circle } from '../Circle';
import { useLinearScale, useTimeScale } from '../hooks';
import { Path } from '../Path';
import { Surface } from '../Surface';
import {
  BaseChartComponentProps,
  LinearScale,
  ObjectWithTime,
  TimeScale,
} from '../types';

type Props<T> = {
  color?: MantineColor;
  tooltip?: (el: T) => ReactNode;
  extent?: [Date, Date];
  thresholds?: number[];
} & BaseChartComponentProps<T, TimeScale, LinearScale<number>>;

export function ScatterChart<T extends ObjectWithTime>({
  data,
  color,
  extent,
  thresholds,
  tooltip,
  xKey,
  yKey,
  xAxis,
  yAxis,
}: Props<T>) {
  const y = useLinearScale({
    data,
    key: yKey,
  });
  const x = useTimeScale({
    data,
    extent,
    key: xKey,
  });
  const lineGen = d3.line<number[]>();

  const getThreshold = (value: number) => [
    [x(x.domain()[0]), y(value)],
    [x(x.domain()[1]), y(value)],
  ];

  return (
    <Surface>
      {thresholds?.map((value) => (
        <Path key={value} d={lineGen(getThreshold(value)) ?? ''} color="gray" />
      ))}
      {data.map((el) => (
        <Tooltip.Floating key={el.time} label={tooltip?.(el) ?? ''}>
          <Circle
            x={x(new Date(el.time))}
            y={y(yKey(el))}
            color={color}
            fill={color}
            size={4}
          />
        </Tooltip.Floating>
      ))}
      {xAxis?.(x)}
      {yAxis?.(y)}
    </Surface>
  );
}
