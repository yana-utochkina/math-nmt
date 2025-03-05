import { useState } from 'react';

interface TaskImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  disableHover?: boolean;
}

export function TaskImage({ 
  src, 
  alt, 
  width = 600, 
  height = 400,
  disableHover = false
}: TaskImageProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <img
      src={`/${src}`}
      alt={alt}
      width={width}
      height={height}
      className={`img-fluid task-image ${hovered ? "hovered" : ""}`}
      onMouseEnter={disableHover ? undefined : () => setHovered(true)}
      onMouseLeave={disableHover ? undefined : () => setHovered(false)}
    />
  );
}