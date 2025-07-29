import { GetIcon } from '@/constants/icons/controlIcons';
import { appState } from '@/libs/state/store';
import { ControlTypes } from '@/libs/types/enums';
import { Dimensions, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

const window = Dimensions.get('window');

function addControl(x: number, y: number) {
  console.log("Tap detected at:", x, y);
  const state = appState.getState();
  const currentCourse = state.currentCourse;
  const currentCourseState = state.currentCourseState;
  const addControlToCurrentRoute = state.addControlToCurrentRoute;

  addControlToCurrentRoute({
    type: ControlTypes.CONTROL,
    coords: [x, y],
    code: 0,
    number: -1,
    symbols: [],
  });
}

export function MapView({ imageUri }: { imageUri: string }) {
  const scale = useSharedValue(1);
  const offsetScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const offsetRotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

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
    .onStart((event) => {
      try {
        runOnJS(addControl)(event.x, event.y);
      } catch (error) {
        console.error("Error handling tap gesture:", error);
      }
    });

  const composed = Gesture.Exclusive(
    tapGesture,
    Gesture.Simultaneous(panGesture, pinchGesture, rotationGesture)
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
  console.log(controls);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          {
            width: window.width,
            height: window.height,
          },
          animatedStyle,
        ]}
      >
        <Animated.Image
          source={{ uri: imageUri }}
          style={{
            width: window.width,
            height: window.height,
          }}
          resizeMode="contain"
        />

        {controls.map((control, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: control.coords[0],
              top: control.coords[1],
              height: 24,
              width: 24,
            }}
          >
            <GetIcon type={control.type} />
            <Text style={{ color: 'white', fontSize: 12 }}>
              {control.code}
            </Text>
          </View>
        ))}
      </Animated.View>

    </GestureDetector>
  )
}
