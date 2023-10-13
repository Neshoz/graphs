import * as d3 from 'd3';
import { RefObject, useLayoutEffect } from 'react';
import { useResponsiveContainer } from '../ResponsiveContainer';

interface Options<T> {
  ref: RefObject<SVGPathElement>;
  data: T[];
  generator: d3.Area<T>;
}

export function useAreaAnimation<T>({ data, generator, ref }: Options<T>) {
  const {
    size: { height, width },
  } = useResponsiveContainer();

  useLayoutEffect(() => {
    const clipRect = d3
      .select('#clip')
      .append('rect')
      .attr('width', 0)
      .attr('height', height);

    clipRect.transition().duration(250).ease(d3.easeSinIn).attr('width', width);
  }, [ref.current, height, width, data, generator]);
}
