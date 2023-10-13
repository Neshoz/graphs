import { SVGAttributes, useRef } from 'react';
import { createStyles } from '@mantine/core';

interface StyleParams {
  variant?: 'filled' | 'outline';
  strokeWidth?: number;
  color: string;
}

const useStyles = createStyles(
  (theme, { color, variant, strokeWidth = 2 }: StyleParams) => ({
    g: {},
    rect: {
      fill: color,
      stroke: color,
      fillOpacity: variant === 'filled' ? 1 : 0.1,
      strokeWidth,
    },
    text: {
      alignmentBaseline: 'middle',
    },
  })
);

interface Props extends SVGAttributes<SVGGElement> {
  x: number | undefined;
  y: number | undefined;
  title: string;
  color: string;
  variant?: 'filled' | 'outline';
  margin?: number;
  size?: number;
}

export function LegendItem({
  x,
  y,
  title,
  color,
  variant = 'filled',
  margin = 10,
  size = 20,
}: Props) {
  const ref = useRef<SVGGElement>(null);
  const { classes } = useStyles({ color, variant });

  return (
    <g
      transform={`translate(${x}, ${y})`}
      ref={ref}
      role="img"
      className={classes.g}
    >
      <rect
        x={margin}
        y={margin}
        width={size}
        height={size}
        className={classes.rect}
      />
      <text
        x={size + size * 1.2}
        y={margin + size / 2}
        textAnchor="left"
        className={classes.text}
      >
        {title}
      </text>
    </g>
  );
}
