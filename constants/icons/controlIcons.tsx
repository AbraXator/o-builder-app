import { ControlTypes } from "@/libs/types/enums";
import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

export const GetIcon = ({ type }: { type: ControlTypes }) => {
  switch (type) {
    case ControlTypes.START:
      return <Start />;
    case ControlTypes.CONTROL:
      return <Control />;
    case ControlTypes.FINISH:
      return <Finish />;
    default:
      return <Control />;
  }
}

export const Start = (props: SvgProps) => (
  <Svg
    viewBox="0 0 23.84 20.65"
    fill="none"
    pointerEvents="none"
    {...props}
  >
    <Path stroke="#ed3288" d="M1.73 19.65L11.92 2 22.11 19.65 1.73 19.65z" />
  </Svg>
)

export const Control = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    pointerEvents="none"
    {...props}
  >
    <Circle cx={12} cy={12} r={11} fill="none" stroke="#ed3288" />
  </Svg>
)

export const Finish = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    pointerEvents="none"
    {...props}
  >
    <Circle cx={12} cy={12} r={11} stroke="#ed3288" />
    <Circle cx={12} cy={12} r={7} stroke="#ed3288" />
  </Svg>
)