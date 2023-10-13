import { timeDays, timeHours, timeMinutes } from 'd3';
import { TimeDataResolution } from '../types';

export const intervalFunctionMap: Record<
  TimeDataResolution,
  (start: Date, stop: Date) => Date[]
> = {
  day: timeDays,
  hour: timeHours,
  minute: timeMinutes,
};

export const dateFormatFunctionMap: Record<
  TimeDataResolution,
  (date: Date) => string
> = {
  day: (date) => date.toDateString(),
  hour: (date) => date.toISOString(),
  minute: (date) => date.toLocaleTimeString(),
};
