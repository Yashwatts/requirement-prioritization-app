import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type CollisionDetection,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const POINTER_ACTIVATION_DISTANCE_PIXELS = 4;
const TOUCH_ACTIVATION_DELAY_MILLISECONDS = 150;
const TOUCH_ACTIVATION_TOLERANCE_PIXELS = 5;

export const useTableSettingsDragAndDropSensors = () => {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_ACTIVATION_DISTANCE_PIXELS,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: TOUCH_ACTIVATION_DELAY_MILLISECONDS,
        tolerance: TOUCH_ACTIVATION_TOLERANCE_PIXELS,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
};

export const tableSettingsCollisionDetectionStrategy: CollisionDetection = (
  collisionArguments,
) => {
  const pointerCollisions = pointerWithin(collisionArguments);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  return rectIntersection(collisionArguments);
};

