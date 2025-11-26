import { GetIcon } from '@/constants/icons/controlIcons';
import { sortControls } from '@/hooks/CourseHooks';
import { appState } from '@/libs/state/store';
import { ControlTypes, InteractionModes } from '@/libs/types/enums';
import { useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import {
  GestureDetector
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import { Notification, NotificationState } from '../Notification';
import { EditGestures, MapGestures, PlaceGestures } from './Gestures';
import { addControl, deselectControl } from './MapViewHelpers';


const window = Dimensions.get('window');

function ControlMarker({ control, index, helperControl, controlOffset, numberOffset }: {
  control: Control;
  index: number;
  helperControl: boolean;
  controlOffset?: SharedValue<Vec>;
  numberOffset?: SharedValue<Vec>;
}) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const interactionMode = appState((s) => s.currentCourseState.mode);
  const isControlSelected = control.index === currentCourseState.selectedControl;
  const baseLeft = control.coords.x - 12;
  const baseTop = control.coords.y - 12;

  const animatedControlStyle = useAnimatedStyle(() => {
    if (!isControlSelected || !controlOffset || controlOffset.value === { x: 0, y: 0} as Vec) {
      return {
        position: 'absolute',
        left: baseLeft,
        top: baseTop,
      };
    }

    return {
      position: 'absolute',
      left: baseLeft + controlOffset.value.x,
      top: baseTop + controlOffset.value.y,
    };
  });

  const animatedNumberStyle = useAnimatedStyle(() => {
    console.log(`Control: ${control.number.coords.x} ${control.number.coords.y}`)

    if (!isControlSelected || !numberOffset) {
      return {
        position: 'absolute',
        left: control.number.coords.x,
        top: control.number.coords.y,
      };
    }

    return {
      position: 'absolute',
      left: control.number.coords.x + numberOffset.value.x,
      top: control.number.coords.y + numberOffset.value.y,
    };
  });

  const handleTap = runOnJS(() => {
    if (interactionMode !== InteractionModes.PLACING) {
      updateCurrentCourseState({ selectedControl: control.index, mode: InteractionModes.EDITING });
    }
  })

  const getControlColor = () => {
    if (isControlSelected) {
      return "#6a32ed";
    }

    return "#ed3288";
  }

  return (
    <Animated.View style={[animatedControlStyle]}>
      <TouchableOpacity
        key={index}
        onPress={handleTap}
        style={{
          height: 24,
          width: 24,
        }}
      >
        <GetIcon type={control.type} props={{
          stroke: getControlColor(),
          strokeOpacity: helperControl ? 0.3 : 1,
        }} />
        {!helperControl && (
          <View
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              minWidth: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <Animated.Text style={[{
              color: "#ed3288",
              fontSize: 16,
            }, animatedNumberStyle]}
            >
              {control.index}
            </Animated.Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

function intersectRayWithTriangle(direction: Vec) {
  const TRIANGLE_VERTICES = [
    { x: -10.2584, y: 10.8378 }, // left base
    { x: 0.0000, y: -9.6755 }, // top
    { x: 10.2584, y: 10.8378 }, // right base
  ] as const;
  let minT = Number.POSITIVE_INFINITY;

  for (let vertex = 0; vertex < TRIANGLE_VERTICES.length; vertex++) {
    const A = TRIANGLE_VERTICES[vertex];
    const B = TRIANGLE_VERTICES[(vertex + 1) % 3];
    const edge = { x: B.x - A.x, y: B.y - A.y };

    const denom = (edge.x * direction.y - edge.y * direction.x);
    if (Math.abs(denom) < 1e-6) continue;

    const u = (direction.x * (A.y) - direction.y * (A.x)) / denom;
    if (u < 0 || u > 1) continue;

    const ix = A.x + edge.x * u;
    const iy = A.y + edge.y * u;

    const t = Math.sqrt(ix * ix + iy * iy);
    if (t > 0 && t < minT) minT = t;
  }

  return minT + 1;
}

function getTrimRadiusForControl(control: Control, nextControl: Control) {
  if (control.type !== ControlTypes.START) return 12;

  const dx = nextControl.coords.x - control.coords.x;
  const dy = nextControl.coords.y - control.coords.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const dir = { x: dx / len, y: dy / len };

  return intersectRayWithTriangle(dir);
}

function ControlLine({ sortedControls }: {
  sortedControls: Control[]
}) {
  let lines = [];

  for (let i = 0; i < sortedControls.length - 1; i++) {
    let coords: Vec[] = [];
    const currentControl = sortedControls[i];
    const nextControl = sortedControls[i + 1];

    if (currentControl.coords.x === nextControl.coords.x &&
      currentControl.coords.y === nextControl.coords.y
    ) {
      continue;
    }

    const trimRadA = getTrimRadiusForControl(currentControl, nextControl);
    const trimRadB = getTrimRadiusForControl(nextControl, currentControl);

    if (nextControl !== null) {
      let dx = nextControl.coords.x - currentControl.coords.x;
      let dy = nextControl.coords.y - currentControl.coords.y;
      let lenght = Math.sqrt(dx * dx + dy * dy);
      if (lenght < 24) continue; //avoid drawing lines between close controls
      let unitX = dx / lenght;
      let unitY = dy / lenght;
      let newAx = currentControl.coords.x + unitX * trimRadA;
      let newAy = currentControl.coords.y + unitY * trimRadA;
      let newBx = nextControl.coords.x - unitX * trimRadB;
      let newBy = nextControl.coords.y - unitY * trimRadB;
      coords.push({ x: newAx, y: newAy });
      coords.push({ x: newBx, y: newBy });
    }

    lines.push(<Polyline
      points={`${coords[0].x},${coords[0].y} ${coords[1].x},${coords[1].y}`}
      key={`${i}-${coords[i]}`}
      stroke="#ed3288"
      strokeWidth="2"
      fill="none"
    />)
  }

  return lines;
}

export function moveMapToCoords(coords: Vec, mapViewProps: MapViewProps) {
  mapViewProps.translationX = -coords.x * mapViewProps.scale + window.width / 2;
  mapViewProps.translationY = -coords.y * mapViewProps.scale + window.height / 2;
}

export type MapViewProps = {
  imageUri: string;
  scale: number;
  rotation: number;
  translationX: number;
  translationY: number;
}

export function MapView({ mapViewProps }: { mapViewProps: MapViewProps }) {
  const imageUri = mapViewProps.imageUri;
  const scale = useSharedValue(mapViewProps.scale);
  const offsetScale = useSharedValue(1);
  const rotation = useSharedValue(mapViewProps.rotation);
  const offsetRotation = useSharedValue(0);
  const translateX = useSharedValue(mapViewProps.translationX);
  const translateY = useSharedValue(mapViewProps.translationY);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const interactionMode = appState((s) => s.currentCourseState.mode);
  const selectedControlType = appState((s) => s.currentCourseState.selectedControlType);
  const [currentNotificationState, setNotificationState] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const setCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const controlOffset = useSharedValue({ x: 0, y: 0 });
  const numberOffset = useSharedValue({ x: 0, y: 0 });
  const controls = appState((s) => s.currentRoute()).controls;
  const currentRoute = currentCourseState.currentRoute;

  const mapGestures = MapGestures({
    translateX,
    translateY,
    offsetX,
    offsetY,
    scale,
    offsetScale,
    rotation,
    offsetRotation,
    deselectControl,
  });
  const placeGestures = PlaceGestures({
    deselectControl,
    addControl,
    setNotificationState
  });
  const editGestures = EditGestures({
    setNotificationState,
    controlOffset,
    numberOffset
  })
  const getCurrentGestures = () => {
    switch (interactionMode) {
      case InteractionModes.NORMAL: return mapGestures;
      case InteractionModes.PLACING: return placeGestures;
      case InteractionModes.EDITING: return editGestures;
    }

  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const sortedControls = sortControls(controls);
  const shouldRenderHelperControls = () => {
    return interactionMode === InteractionModes.PLACING && currentCourseState.currentRoute !== 0;
  }

  return (
    <GestureDetector gesture={getCurrentGestures()}>
      <Animated.View
        style={[
          {
            width: window.width,
            height: window.height,
          },
          animatedStyle,
        ]}
      >
        {currentNotificationState.show && <Notification
          message={currentNotificationState.message}
          type={currentNotificationState.type}
          onClose={() => setNotificationState({ show: false, message: '', type: 'info' })}
        />}
        <Animated.Image
          source={{ uri: imageUri }}
          style={{
            width: window.width,
            height: window.height,
          }}
          resizeMode="contain"
        />

        {currentRoute !== 0 &&
          <Svg
            height={window.height}
            width={window.width}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <ControlLine sortedControls={sortedControls} />
          </Svg>}

        {controls.map((control, index) => (
          <ControlMarker key={index} control={control} index={index} helperControl={false} controlOffset={controlOffset} numberOffset={numberOffset} />
        ))}

        {shouldRenderHelperControls() && currentCourse.routes[0].controls.map((control, index) => (
          <ControlMarker key={index} control={control} index={index} helperControl={true} />
        ))}

      </Animated.View>

    </GestureDetector>
  )
}
