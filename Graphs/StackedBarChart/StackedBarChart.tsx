// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Fragment, ReactNode } from 'react';
import { Bar } from '../Bar';
import { useTimeScale, useLinearScale } from '../hooks';
import { Surface } from '../Surface';
import * as d3 from 'd3';

interface Props<T> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  layerKeys: Array<keyof T>;
  colors: (key: keyof T) => string;
  variant?: 'filled' | 'outline';
  label?: (item: T) => ReactNode;
  xAxis?: ReactNode;
  yAxis?: ReactNode;
  dateExtent?: [Date, Date];
  legend?: ReactNode;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Stacked Bar Chart
 *
 * @todo Make bar width customizable via a property, now hardcoded to 75% of time bin size.
 *
 * @param param0
 * @returns
 */
export function StackedBarChart<T>({
  data,
  xKey,
  yKey,
  layerKeys,
  xAxis,
  yAxis,
  colors,
  variant = 'filled',
  dateExtent,
  legend,
}: Props<T>) {
  const x = useTimeScale({
    data,
    key: (d) => new Date(d[xKey]),
    autoScale: false,
    extent: dateExtent,
  });
  const y = useLinearScale({ data, key: (d) => d[yKey] });

  const layers = d3.stack<T>().keys(layerKeys)(data);

  return (
    <Surface>
      {layers.map((layer, layerIndex) =>
        layer
          .filter((entry) => !Number.isNaN(entry[0]) && !Number.isNaN(entry[1]))
          .map((entry, entryIndex) => (
            <Fragment key={`${layerIndex}-${entryIndex}`}>
              <Bar
                width={
                  0.75 *
                  Math.abs(
                    x(addDays(new Date(entry.data[xKey]), 1)) -
                      x(new Date(entry.data[xKey]))
                  )
                }
                height={Math.abs(y(entry[0]) - y(entry[1]))}
                x={x(new Date(entry.data[xKey]))}
                y={y(entry[1])}
                color={colors(layer.key)}
                variant={variant}
              />
            </Fragment>
          ))
      )}
      {xAxis}
      {yAxis}
      {legend}
    </Surface>
  );
}
