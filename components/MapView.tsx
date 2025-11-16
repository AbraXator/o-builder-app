import { GetIcon } from '@/constants/icons/controlIcons';
import { appState } from '@/libs/state/store';
import { ControlTypes, InteractionModes } from '@/libs/types/enums';
import { useState } from 'react';
import { Dimensions, Text, TouchableOpacity } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import { Notification, NotificationState } from './Notification';


const window = Dimensions.get('window');

function ControlMarker({ control, index, helperControl }: { control: Control; index: number, helperControl: boolean }) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const interactionMode = appState((s) => s.currentCourseState.mode);

  const handleTap = runOnJS(() => {
    if (interactionMode === InteractionModes.INTERACTING) {
      updateCurrentCourseState({ selectedControl: index });
    }
  })

  const getControlColor = () => {
    if (currentCourseState.selectedControl === index) {
      return "#6a32ed";
    }

    return "#ed3288";
  }

  return (
    <TouchableOpacity
      key={index}
      onPress={handleTap}
      style={{
        position: 'absolute',
        left: control.coords.x - 12,
        top: control.coords.y - 12,
        height: 24,
        width: 24,
      }}
    >
      <GetIcon type={control.type} props={{
        stroke: getControlColor(),
        strokeOpacity: helperControl ? 0.2 : 1,
      }} />
      <Text style={{ color: 'white', fontSize: 12 }}>
        {control.code}
      </Text>
    </TouchableOpacity>

  )
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

    const trimRad = nextControl.type === ControlTypes.START ? 15.4 : 12;

    if (nextControl !== null) {
      let dx = nextControl.coords.x - currentControl.coords.x;
      let dy = nextControl.coords.y - currentControl.coords.y;
      let lenght = Math.sqrt(dx * dx + dy * dy);
      if (lenght < 24) continue; //avoid drawing lines between close controls
      let unitX = dx / lenght;
      let unitY = dy / lenght;
      let newAx = currentControl.coords.x + unitX * trimRad;
      let newAy = currentControl.coords.y + unitY * trimRad;
      let newBx = nextControl.coords.x - unitX * trimRad;
      let newBy = nextControl.coords.y - unitY * trimRad;
      coords.push({x: newAx, y: newAy});
      coords.push({x: newBx, y: newBy});
    }

    lines.push(<Polyline
      points={`${coords[0]},${coords[1]}`}
      key={`${i}-${coords[i]}`}
      stroke="#ed3288"
      strokeWidth="2"
      fill="none"
    />)
  }

  return lines;
}

function addControl(x: number, y: number, type: ControlType, controlsList: Control[], setNotification: SetState<NotificationState>) {
  console.log("Tap detected at:", x, y);
  const state = appState.getState();
  const currentCourse = state.currentCourse;
  const currentCourseState = state.currentCourseState;
  const addControlToCurrentRoute = state.addControlToCurrentRoute;
  const addControlToAllControls = state.addControlToAllControls;
  const currentRoute = state.currentRoute();
  const initDefaultControl: Control = {
    type: type,
    coords: {x, y},
    code: 0,
    number: -1,
    symbols: [
      {
        kind: "C",
        symbolId: -1,
      },
      {
        kind: "D",
        symbolId: -1,
      },
      {
        kind: "E",
        symbolId: -1,
      },
      {
        kind: "F",
        symbolId: -1,
      },
      {
        kind: "G",
        symbolId: -1,
      }
    ],
  };

  const cannotAddControl = (type: ControlType) => {
    return (type === ControlTypes.FINISH || type === ControlTypes.START) && controlsList.some(c => c.type === type);
  }

  if (cannotAddControl(type)) {
    setNotification({
      show: true,
      message: `Cannot add ${type} control more than once.`,
      type: 'error',
    });

    return;
  }

  addControlToCurrentRoute(initDefaultControl);
  //addControlToAllControls(initDefaultControl);
}

function deselectControl(setCurrentCourseState: (data: Partial<CourseState>) => void, currentCourseState: CourseState) {
  console.log("Deselecting control");
  if (currentCourseState.mode !== InteractionModes.PLACING && currentCourseState.selectedControl !== null) {
    setCurrentCourseState({ selectedControl: null });
    console.log(currentCourseState.selectedControl);
  }
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

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = offsetScale.value * event.scale;
    })
    .onEnd(() => {
      offsetScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = offsetRotation.value + event.rotation;
    })
    .onEnd(() => {
      offsetRotation.value = rotation.value;
    });

  const tapGesture = Gesture.Tap()
    .onStart(runOnJS((event) => {
      try {
        deselectControl(setCurrentCourseState, currentCourseState);
        addControl(event.x, event.y, selectedControlType, appState.getState().currentRoute().controls, setNotificationState);
      } catch (error) {
        console.error("Error handling tap gesture:", error);
      }
    }));

  const composed = Gesture.Exclusive(
    panGesture, pinchGesture, rotationGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const controls = appState((s) => s.currentRoute()).controls;
  const sortedControls: Control[] = [
    ...controls.filter((c: Control) => c.type === 'start'),
    ...controls.filter((c: Control) => c.type === 'control'),
    ...controls.filter((c: Control) => c.type === 'finish')
  ]
  const shouldRenderHelperControls = () => {
    return interactionMode === InteractionModes.PLACING && currentCourseState.currentRoute !== 0;
  }

  console.log(shouldRenderHelperControls());

  return (
    <GestureDetector gesture={interactionMode !== InteractionModes.PLACING ? composed : tapGesture}>
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

        <Svg
          height={window.height}
          width={window.width}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <ControlLine sortedControls={sortedControls}/>
        </Svg>

        {controls.map((control, index) => (
          <ControlMarker key={index} control={control} index={index} helperControl={false} />
        ))}

        {shouldRenderHelperControls() && currentCourse.routes[0].controls.map((control, index) => (
          <ControlMarker key={index} control={control} index={index} helperControl={true} />
        ))}

      </Animated.View>

    </GestureDetector>
  )
}
