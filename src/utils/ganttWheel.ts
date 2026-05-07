type WheelLike = {
  deltaX: number;
  deltaY: number;
  shiftKey?: boolean;
  ctrlKey?: boolean;
};

const WHEEL_NOISE_THRESHOLD = 0.5;
const VERTICAL_DOMINANCE_RATIO = 1.25;

export const shouldNormalizeGanttWheel = (event: WheelLike): boolean => {
  if (event.shiftKey || event.ctrlKey) return false;

  const absX = Math.abs(event.deltaX);
  const absY = Math.abs(event.deltaY);

  if (absX <= WHEEL_NOISE_THRESHOLD || absY <= WHEEL_NOISE_THRESHOLD) return false;
  return absY >= absX * VERTICAL_DOMINANCE_RATIO;
};

