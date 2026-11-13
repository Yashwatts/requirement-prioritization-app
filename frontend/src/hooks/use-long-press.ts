import { useCallback, useRef, type MouseEvent, type PointerEvent } from "react";

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
  moveThreshold?: number;
}

export const useLongPress = ({
  onLongPress,
  onClick,
  delay = 500,
  moveThreshold = 10,
}: UseLongPressOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = useRef(false);
  const startCoordinatesRef = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(
    (event: PointerEvent) => {
      // Only react to primary pointer button (left click or touch)
      if (event.button !== 0) return;

      isLongPressTriggeredRef.current = false;
      startCoordinatesRef.current = { x: event.clientX, y: event.clientY };

      timerRef.current = setTimeout(() => {
        isLongPressTriggeredRef.current = true;
        onLongPress();
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          try {
            navigator.vibrate(40);
          } catch {
            // Ignore vibration errors on unsupported environments
          }
        }
      }, delay);
    },
    [onLongPress, delay],
  );

  const clear = useCallback(
    (shouldTriggerClick = false) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (shouldTriggerClick && !isLongPressTriggeredRef.current) {
        onClick?.();
      }

      startCoordinatesRef.current = null;
      isLongPressTriggeredRef.current = false;
    },
    [onClick],
  );

  const move = useCallback(
    (event: PointerEvent) => {
      if (!startCoordinatesRef.current) return;

      const deltaX = Math.abs(event.clientX - startCoordinatesRef.current.x);
      const deltaY = Math.abs(event.clientY - startCoordinatesRef.current.y);

      // Cancel if user moved finger/pointer beyond threshold (e.g. scrolling)
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    },
    [moveThreshold],
  );

  return {
    onPointerDown: start,
    onPointerUp: () => clear(true),
    onPointerMove: move,
    onPointerCancel: () => clear(false),
    onPointerLeave: () => clear(false),
    onContextMenu: (event: MouseEvent) => {
      event.preventDefault();
    },
  };
};

