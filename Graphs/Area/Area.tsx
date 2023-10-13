import { MantineColor, useMantineTheme } from '@mantine/core';
import { SVGAttributes, useRef } from 'react';
import { useChartContext } from '../Chart';
import { useLineAnimation } from '../Line/use-line-animation';
import { useLineGenerator } from '../Line/use-line-generator';
import { Path } from '../Path';
import { ObjectWithTime } from '../types';
import { useAreaAnimation } from './use-area-animation';
import { useAreaGenerator } from './use-area-generator';

interface AreaProps<T> extends SVGAttributes<SVGPathElement> {
  dataKey: keyof T;
  data?: T[];
  color?: MantineColor | 'brand';
  line?: boolean;
}

export function Area<T extends ObjectWithTime>({
  color = 'blue',
  data,
  dataKey,
  line = true,
  ...rest
}: AreaProps<T>) {
  const areaRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGClipPathElement>(null);
  const theme = useMantineTheme();
  const chartData = useChartContext<T[]>();
  const dataSource = data ?? chartData;
  const generator = useAreaGenerator({ data: dataSource, dataKey });
  const lineGenerator = useLineGenerator({ data: dataSource, dataKey });

  useAreaAnimation({
    data: dataSource,
    generator,
    ref: areaRef,
  });
  useLineAnimation({
    data: dataSource,
    ref: lineRef,
    generator: lineGenerator,
  });

  const colorScheme = theme.colors[color][5];

  return (
    <>
      <clipPath id="clip" ref={clipRef} />
      {line && (
        <Path
          ref={lineRef}
          d={lineGenerator(data ?? []) ?? ''}
          fill="none"
          color={color}
          strokeWidth={2}
          clipPath="url(#clip)"
        />
      )}
      <path
        {...rest}
        d={generator(data ?? []) ?? ''}
        ref={areaRef}
        fill={colorScheme}
        fillOpacity={0.1}
        clipPath="url(#clip)"
      />
    </>
  );
}
