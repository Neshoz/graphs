import { Tooltip } from '@mantine/core';
import { ReactNode, useRef } from 'react';
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
import { LineProps } from './Line';
import { useLineAnimation } from './use-line-animation';
import { useLineGeneratorNew } from './use-line-generator';

type Props<T extends ObjectWithTime> = BaseChartComponentProps<
  T,
  TimeScale,
  LinearScale<number>
> &
  Pick<LineProps<T>, 'color' | 'circle'> & {
    extent?: [Date, Date];
    tooltip?: (el: T) => ReactNode;
    onCircleClick?: (el: T) => void;
  };

export function LineChart<T extends ObjectWithTime>({
  data,
  color,
  circle,
  extent,
  onCircleClick,
  tooltip,
  xKey,
  yKey,
  xAxis,
  yAxis,
}: Props<T>) {
  const ref = useRef<SVGPathElement>(null);
  const timeScale = useTimeScale({
    data,
    extent,
    key: xKey,
  });
  const linearScale = useLinearScale<T>({
    data,
    key: yKey,
  });
  const lineGenerator = useLineGeneratorNew({
    xKey,
    yKey,
    xScale: timeScale,
    yScale: linearScale,
  });

  useLineAnimation({
    data,
    ref,
    generator: lineGenerator,
  });

  return (
    <Surface>
      <Path ref={ref} d={lineGenerator(data) ?? ''} color={color} />
      {circle &&
        data.map((el) => {
          const cx = timeScale(xKey(el));
          const cy = linearScale(yKey(el));

          return (
            <Tooltip.Floating key={el.time} label={tooltip?.(el)}>
              <Circle
                x={cx}
                y={cy}
                color={color}
                fill={color}
                size={4}
                onClick={() => onCircleClick?.(el)}
              />
            </Tooltip.Floating>
          );
        })}
      {xAxis?.(timeScale)}
      {yAxis?.(linearScale)}
    </Surface>
  );
}
