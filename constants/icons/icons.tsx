import * as React from "react";
import Svg, { Circle, Path, Rect, SvgProps } from "react-native-svg";

export const Sun = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-sun-icon lucide-sun"
    {...props}
  >
    <Circle cx={12} cy={12} r={4} />
    <Path d="M12 2v2" />
    <Path d="M12 20v2" />
    <Path d="m4.93 4.93 1.41 1.41" />
    <Path d="m17.66 17.66 1.41 1.41" />
    <Path d="M2 12h2" />
    <Path d="M20 12h2" />
    <Path d="m6.34 17.66-1.41 1.41" />
    <Path d="m19.07 4.93-1.41 1.41" />
  </Svg>
);

export const Language = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-languages-icon lucide-languages"
    {...props}
  >
    <Path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
  </Svg>
)

export const Settings = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <Path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
    <Circle cx={12} cy={12} r={3} />
  </Svg>
)

export const Back = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <Path d="M15 21v-8a1 1 0 00-1-1h-4a1 1 0 00-1 1v8" />
    <Path d="M3 10a2 2 0 01.709-1.528l7-5.999a2 2 0 012.582 0l7 5.999A2 2 0 0121 10v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </Svg>
)

export const Home = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-house-icon lucide-house"
    {...props}
  >
    <Path d="M15 21v-8a1 1 0 00-1-1h-4a1 1 0 00-1 1v8" />
    <Path d="M3 10a2 2 0 01.709-1.528l7-5.999a2 2 0 012.582 0l7 5.999A2 2 0 0121 10v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </Svg>
)

export const Pointer = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-pointer-icon lucide-pointer"
    {...props}
  >
    <Path d="M22 14a8 8 0 01-8 8M18 11v-1a2 2 0 00-2-2 2 2 0 00-2 2M14 10V9a2 2 0 00-2-2 2 2 0 00-2 2v1M10 9.5V4a2 2 0 00-2-2 2 2 0 00-2 2v10" />
    <Path d="M18 11a2 2 0 114 0v3a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15" />
  </Svg>
)


export const ChooseControlType = (props: SvgProps) => (
  <Svg
    viewBox="0 0 23.75 23.75"
    fill="none"
    width={24}
    height={24}
    {...props}
  >
    <Circle cx={5.72} cy={18.03} r={5.22} stroke="#ed3288" />
    <Circle cx={18.09} cy={17.97} r={5.16} stroke="#ed3288" />
    <Circle cx={18.09} cy={17.97} r={3.28} stroke="#ed3288" />
    <Path stroke="#ed3088" d="M6.23 10.68L11.82 1 17.41 10.68 6.23 10.68z" />
  </Svg>
)

export const Trashcan = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-trash2-icon lucide-trash-2"
    {...props}
  >
    <Path d="M10 11v6M14 11v6M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </Svg>
)

export const Undo = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-undo-icon lucide-undo"
    {...props}
  >
    <Path d="M3 7v6h6" />
    <Path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
  </Svg>
)

export const Checkmark = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-check-icon lucide-check"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
)

export const Alert = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-circle-alert-icon lucide-circle-alert"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 8L12 12" />
    <Path d="M12 16L12.01 16" />
  </Svg>
)

export const Info = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-info-icon lucide-info"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 16v-4M12 8h.01" />
  </Svg>
)

export const Save = (props: SvgProps) => (
      <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-save-icon lucide-save"
      {...props}
    >
      <Path d="M15.2 3a2 2 0 011.4.6l3.8 3.8a2 2 0 01.6 1.4V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <Path d="M17 21v-7a1 1 0 00-1-1H8a1 1 0 00-1 1v7M7 3v4a1 1 0 001 1h7" />
    </Svg>
)

export const Print = (props: SvgProps) => (
      <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-printer-icon lucide-printer"
      {...props}
    >
      <Path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 9V3a1 1 0 011-1h10a1 1 0 011 1v6" />
      <Rect x={6} y={14} width={12} height={8} rx={1} />
    </Svg>
)