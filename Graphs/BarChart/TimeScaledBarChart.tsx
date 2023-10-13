import * as d3 from 'd3';
import { Tooltip } from '@mantine/core';
import { ReactNode } from 'react';
import { Bar, BarProps } from '../Bar/Bar';
import {
  dateFormatFunctionMap,
  useLinearScale,
  useTimeScale,
  useTimeScaleMappedBandScale,
} from '../hooks';
import { useResponsiveContainer } from '../ResponsiveContainer';
import { Surface } from '../Surface';
import {
  BaseChartComponentProps,
  ObjectWithTime,
  TimeDataResolution,
  TimeScale,
} from '../types';
import { Path } from '../Path';

type BarLabelRenderProps<T> = {
  x: number;
  y: number;
  el: T;
};

type Props<T> = BaseChartComponentProps<T, TimeScale> &
  Pick<BarProps, 'color' | 'variant'> & {
    extent?: [Date, Date];
    thresholds?: number[];
    resolution?: TimeDataResolution;
    barLabel?: (props: BarLabelRenderProps<T>) => ReactNode;
    tooltip?: (el: T) => ReactNode;
    onBarClick?: (el: T) => void;
  };

export function TimeScaledBarChart<T extends ObjectWithTime>({
  data,
  color,
  variant,
  extent,
  thresholds,
  resolution = 'day',
  xKey,
  yKey,
  xAxis,
  barLabel,
  tooltip,
  onBarClick,
}: Props<T>) {
  const {
    size: { height },
    margin,
  } = useResponsiveContainer();

  const x = useTimeScale({
    data,
    key: xKey,
    extent,
  });
  const y = useLinearScale({
    data,
    key: yKey,
  });
  const bandScale = useTimeScaleMappedBandScale(x, resolution);
  const dateFormatFunction = dateFormatFunctionMap[resolution];

  const barWidth = bandScale.bandwidth();
  const barX = (el: T) => bandScale(dateFormatFunction(new Date(el.time)));
  const barHeight = height - margin.bottom;
  const x1 = x(x.domain()[0]);
  const x2 = x(x.domain()[1]);
  const gen = d3.line<number[]>();

  const getThreshold = (threshold: number) => [
    [x1, y(threshold)],
    [x2, y(threshold)],
  ];

  return (
    <Surface>
      {thresholds?.map((value) => (
        <Path key={value} d={gen(getThreshold(value)) ?? ''} color="gray" />
      ))}
      {data.map((el) => (
        <g key={new Date(el.time).getTime()}>
          <Tooltip.Floating disabled={!tooltip} label={tooltip?.(el)}>
            <Bar
              width={barWidth}
              height={barHeight - y(yKey(el))}
              x={barX(el)}
              y={y(yKey(el))}
              color={color}
              variant={variant}
              onClick={() => onBarClick?.(el)}
            />
          </Tooltip.Floating>
          {barLabel?.({
            el,
            x: Number(barX(el)) + barWidth / 2,
            y: y(yKey(el)) + barHeight / 2,
          })}
        </g>
      ))}
      {xAxis?.(x)}
    </Surface>
  );
}
