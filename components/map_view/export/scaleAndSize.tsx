//size is in 300dpi
export type PaperSize = {
  name: string;
  width: number;
  height: number;
}

export const A3: PaperSize = { name: "A3", width: 3508, height: 4961 }
export const A4: PaperSize = { name: "A4", width: 2480, height: 3508 }
export const A5: PaperSize = { name: "A5", width: 1748, height: 2480 }

const DPI = 300;

export function scaleForPrint(scaleValue: number) {
  const CM_TO_INCH = 1 / 2.54;

  const pxPerCm = DPI * CM_TO_INCH;
  const metersPerCm = scaleValue / 100; // 1:4000 → 40m per cm

  const exportPxPerMeter = pxPerCm / metersPerCm;

  return exportPxPerMeter;
}

