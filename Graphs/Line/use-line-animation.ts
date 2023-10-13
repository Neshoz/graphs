/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as d3 from 'd3';
import { RefObject, useEffect } from 'react';

interface Options<T> {
  ref: RefObject<SVGPathElement>;
  data: T[];
  generator: d3.Line<T>;
}

export function useLineAnimation<T>({ data, ref, generator }: Options<T>) {
  useEffect(() => {
    if (ref.current) {
      const length = ref.current.getTotalLength();
      d3.select(ref.current)
        .attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(250)
        .ease(d3.easeSinIn)
        .attr('stroke-dashoffset', 0);
    }
  }, [ref.current, data, generator]);
}
