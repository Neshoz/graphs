import { forwardRef, SVGProps } from 'react';
import { MantineColor, createStyles } from '@mantine/core';

interface StyleParams {
  color: MantineColor | 'brand';
  variant?: 'filled' | 'outline';
  strokeWidth?: number;
}

const useStyles = createStyles(
  (theme, { color, variant, strokeWidth = 2 }: StyleParams) => ({
    rect: {
      fill: theme.colors[color][5],
      stroke: theme.colors[color][5],
      fillOpacity: variant === 'filled' ? 1 : 0.1,
      strokeWidth,
    },
  })
);

export type BarProps = {
  x: number | undefined;
  y: number | undefined;
  width: number;
  height: number;
  color?: MantineColor | 'brand';
  variant?: 'filled' | 'outline';
} & SVGProps<SVGRectElement>;

export const Bar = forwardRef<SVGRectElement, BarProps>(function Bar(
  { color = 'blue', variant = 'filled', x, y, width, height, ...rest },
  ref
) {
  const { classes } = useStyles({ color, variant });

  return (
    <rect
      {...rest}
      ref={ref}
      className={classes.rect}
      x={x}
      y={y}
      width={width}
      height={height}
    />
  );
});
