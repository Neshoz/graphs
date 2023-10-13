/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as d3 from 'd3';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { useMemo } from 'react';
import { useResponsiveContainer } from '../ResponsiveContainer';
import {
  LinearScaleOptions,
  TimeDataResolution,
  TimeScale,
  TimeScaleOptions,
} from '../types';
import { dateFormatFunctionMap, intervalFunctionMap } from './helpers';

interface Options<T, K = unknown> {
  data: T[];
  key?: (item: T) => K;
}

export function useXScale<T>({ data, key }: Options<T>) {
  const {
    size: { width },
    margin,
  } = useResponsiveContainer();

  return useMemo(() => {
    return d3
      .scaleTime()
      .range([margin.left, width - margin.right])
      .domain(
        // @ts-ignore
        d3.extent(data, (d, i) => {
          return key ? key(d) : i;
        })
      );
  }, [data, width, margin]);
}

export function useYScale<T>({ data, key }: Options<T>) {
  const {
    size: { height },
    margin,
  } = useResponsiveContainer();

  return useMemo(() => {
    return (
      d3
        .scaleLinear()
        .range([height - margin.bottom, margin.top])
        // @ts-ignore
        .domain([0, d3.max(data, key)])
    );
  }, [data, height, margin]);
}

export function useLinearScale<T>({
  data,
  direction = 'vertical',
  key,
}: LinearScaleOptions<T>) {
  const {
    size: { height, width },
    margin,
  } = useResponsiveContainer();

  return useMemo(() => {
    const range =
      direction === 'horizontal'
        ? [margin.left, width - margin.right]
        : [height - margin.bottom, margin.top];

    return (
      d3
        .scaleLinear()
        .range(range)
        // @ts-ignore
        .domain([0, d3.max(data, key)])
    );
  }, [data, height, margin, direction]);
}

export function useTimeScale<T>({ data, key, extent }: TimeScaleOptions<T>) {
  const {
    size: { width },
    margin,
  } = useResponsiveContainer();

  return useMemo(() => {
    return (
      d3
        .scaleTime()
        .range([margin.left, width - margin.right])
        // @ts-ignore
        .domain(extent || d3.extent(data, (d) => key(d)))
    );
  }, [extent, data, width, margin]);
}

export function useBandScale<T>({ data, key }: Required<Options<T, string>>) {
  const {
    size: { width },
    margin,
  } = useResponsiveContainer();

  return useMemo(() => {
    return d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .domain(data.map((d) => key(d)))
      .padding(0.2);
  }, [data, width, margin]);
}

export function useTimeScaleMappedBandScale(
  scale: TimeScale,
  resolution: TimeDataResolution = 'day'
) {
  const {
    size: { width },
    margin,
  } = useResponsiveContainer();

  return useMemo(() => {
    const intervalFunction = intervalFunctionMap[resolution];
    const dateFormatFunction = dateFormatFunctionMap[resolution];
    /*
      timeDay.range picks the date after supplied start date and sets the
      time to 00:00.
      We need a way for our domain to assume the extent values.
      For the timeHour function, we need to control this via a resolution derived from the data,
      and grabbed via the intervalFunctionMap.
    */
    const domain = intervalFunction(
      startOfDay(subDays(new Date(scale.domain()[0]), 1)),
      endOfDay(new Date(scale.domain()[1]))
    ).map(dateFormatFunction);

    return d3
      .scaleBand()
      .domain(domain)
      .range([margin.left, width - margin.right])
      .padding(0.2);
  }, [scale]);
}
