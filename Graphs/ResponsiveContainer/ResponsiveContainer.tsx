import { createContext, ReactNode, RefObject, useMemo } from 'react';
import { useResizeObserver } from '@mantine/hooks';
import { useGuardedContext } from '../../../hooks';

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Position {
  x: number;
  y: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Size {
  width: number;
  height: number;
}

interface Container {
  ref: RefObject<HTMLDivElement | null>;
  position: Position;
  size: Size;
  margin: Margin;
}

const defaultMargins: Margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const ResponsiveContainerContext = createContext<Container | undefined>(
  undefined
);

interface ResponsiveContainerProps {
  children: ReactNode;
  height?: string | number;
  width?: string | number;
  minHeight?: string | number;
  margin?: Partial<Margin>;
}

export const ResponsiveContainer = ({
  children,
  height = '100%',
  width = '100%',
  margin,
  minHeight,
}: ResponsiveContainerProps) => {
  const [ref, rect] = useResizeObserver<HTMLDivElement>();

  const value = useMemo<Container>(
    () => ({
      ref,
      position: {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        x: rect.x,
        y: rect.y,
      },
      size: {
        height: rect.height,
        width: rect.width,
      },
      margin: {
        ...defaultMargins,
        ...margin,
      },
    }),
    [rect]
  );

  return (
    <ResponsiveContainerContext.Provider value={value}>
      <div
        style={{
          height,
          width,
          minHeight,
        }}
        ref={ref}
      >
        {children}
      </div>
    </ResponsiveContainerContext.Provider>
  );
};

export function useResponsiveContainer() {
  return useGuardedContext(ResponsiveContainerContext);
}
