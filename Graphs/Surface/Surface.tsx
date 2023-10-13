import { ReactNode, SVGAttributes } from 'react';
import { useResponsiveContainer } from '../ResponsiveContainer';

interface SurfaceProps extends SVGAttributes<SVGElement> {
  children: ReactNode;
}

export const Surface = ({ children, ...rest }: SurfaceProps) => {
  const { size } = useResponsiveContainer();
  const { width, height } = size;
  const actualWidth = width ?? rest.width ?? 0;
  const actualHeight = height ?? rest.height ?? 0;
  const viewBox = `0 0 ${actualWidth} ${actualHeight}`;

  return (
    <svg
      {...rest}
      width={actualWidth}
      height={actualHeight}
      viewBox={viewBox}
      style={{ minHeight: 'auto' }}
    >
      {children}
    </svg>
  );
};
