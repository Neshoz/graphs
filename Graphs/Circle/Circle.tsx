import { ForwardedRef, forwardRef, MouseEvent, SVGProps } from 'react';
import { createStyles, MantineColor } from '@mantine/core';
import { mode } from '../../../theme';
import { useBoolean, useColor } from '../../../hooks';

interface StyleParams {
  color: MantineColor | 'brand';
  fill?: MantineColor;
  isHovered: boolean;
}

const useStyles = createStyles(
  (theme, { color, isHovered, fill }: StyleParams) => ({
    circle: {
      fill: isHovered
        ? color
        : fill
        ? color
        : mode(theme.colors.dark[7], theme.colors.gray[0])(theme),
      stroke: color,
      strokeWidth: 2,
      transition: 'all .250s ease-in',
    },
  })
);

export interface CircleProps extends SVGProps<SVGCircleElement> {
  color?: MantineColor | 'brand';
  size?: number;
  x: number;
  y: number;
}

export const Circle = forwardRef(
  (
    {
      color = 'blue',
      size = 6,
      x,
      y,
      fill,
      onMouseEnter,
      onMouseLeave,
      ...rest
    }: CircleProps,
    ref: ForwardedRef<SVGCircleElement>
  ) => {
    const [isHovered, setters] = useBoolean();
    const c = useColor(color);
    const { classes } = useStyles({ color: c, isHovered, fill });

    const handleMouseEnter = (event: MouseEvent<SVGCircleElement>) => {
      setters.on();
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: MouseEvent<SVGCircleElement>) => {
      setters.off();
      onMouseLeave?.(event);
    };

    return (
      <circle
        {...rest}
        ref={ref}
        className={classes.circle}
        r={size}
        cx={x}
        cy={y}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
  }
);
