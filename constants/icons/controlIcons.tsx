import { ControlTypes } from "@/libs/types/enums";
import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

export const GetIcon = (
  { type, props }: { type: ControlTypes; props?: SvgProps } = { type: ControlTypes.CONTROL, props: { stroke: "#ed3288" } }
) => {
  switch (type) {
    case ControlTypes.START:
      return <Start {...(props || { stroke: "#ed3288" })} />;
    case ControlTypes.CONTROL:
      return <Control {...(props || { stroke: "#ed3288" })} />;
    case ControlTypes.FINISH:
      return <Finish {...(props || { stroke: "#ed3288" })} />;
    default:
      return <Control {...(props || { stroke: "#ed3288" })} />;
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
    <Circle cx={12} cy={12} r={11} fill="none" />
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