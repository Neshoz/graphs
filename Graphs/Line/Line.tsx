import { useRef } from 'react';
import { useChartContext } from '../Chart';
import { useLineGenerator } from './use-line-generator';
import { useLineAnimation } from './use-line-animation';
import { CircleType } from './types';
import { ObjectWithTime } from '../types';
import { Path, PathProps } from '../Path';
import { LineCircles } from './LineCircles';

export type LineProps<T extends ObjectWithTime> = {
  dataKey: keyof T;
  data?: T[];
  circle?: CircleType<T>;
} & PathProps;

export function Line<T extends ObjectWithTime>({
  color = 'blue',
  data,
  dataKey,
  circle,
}: LineProps<T>) {
  const ref = useRef<SVGPathElement>(null);
  const chartData = useChartContext<T[]>();
  const dataSource = data ?? chartData;
  const generator = useLineGenerator<T>({ data: dataSource, dataKey });

  /*
    This bricks support for dashed variant and gaps, because this explicitly
    creates a stroke-dasharray. We should pass the variant and the gap and
    create a stroke-dasharray from that instead.
  */
  useLineAnimation({
    data: dataSource,
    ref,
    generator,
  });

  return (
    <>
      <Path d={generator(data ?? []) ?? ''} ref={ref} color={color} />
      {circle && (
        <LineCircles
          data={dataSource}
          dataKey={dataKey}
          circle={circle}
          color={color}
        />
      )}
    </>
  );
}
