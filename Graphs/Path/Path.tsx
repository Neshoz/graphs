import { MantineColor } from '@mantine/core';
import { forwardRef, SVGProps } from 'react';
import { useColor } from '../../../hooks';

export type PathProps = {
  color?: MantineColor;
} & Omit<SVGProps<SVGPathElement>, 'color'>;

export const Path = forwardRef<SVGPathElement, PathProps>(function Path(
  { color = 'blue', strokeWidth = 2, ...rest },
  ref
) {
  const colorScheme = useColor(color);

  return (
    <path
      {...rest}
      ref={ref}
      fill="none"
      stroke={colorScheme}
      strokeWidth={strokeWidth}
    />
  );
});
