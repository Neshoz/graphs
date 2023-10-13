import { ReactNode, SVGProps } from 'react';
import {
  MantineColor,
  MantineNumberSize,
  useMantineTheme,
} from '@mantine/core';
import { useColor } from '../../../hooks';

type Props = {
  x: number;
  y: number;
  children: ReactNode;
  color?: MantineColor;
  size?: MantineNumberSize;
} & Omit<SVGProps<SVGTextElement>, 'color'>;

export const BarLabel = ({
  x,
  y,
  children,
  color = 'gray',
  size = 'md',
  textAnchor = 'middle',
  ...rest
}: Props) => {
  const theme = useMantineTheme();
  const colorScheme = useColor(color);
  const fontSize = typeof size === 'number' ? size : theme.fontSizes[size];

  return (
    <text
      {...rest}
      x={x}
      y={y}
      fontSize={fontSize}
      fill={colorScheme}
      textAnchor={textAnchor}
      pointerEvents="none"
    >
      {children}
    </text>
  );
};
