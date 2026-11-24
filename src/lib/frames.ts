/**
 * Measured photo windows for each hanging frame (generated from the frame PNGs' alpha/dark areas).
 * - box:  where the clipping mask sits, as % of the frame image (left, top, width, height)
 * - rect: the photo rectangle inside that box, as % (centerX, centerY, width, height), incl. bleed under the border
 * - angle: tilt of the window, so the photo sits straight in the frame
 */
export type FrameGeo = {
  image: string;
  mask: string;
  width: number;
  height: number;
  box: [number, number, number, number];
  rect: [number, number, number, number];
  angle: number;
  /** transform-origin for the swing, at the chain's hook (% of frame) */
  pivot?: [number, number];
};

export const frames = {
  left: {
    image: "/images/frame-left.png",
    mask: "/images/masks/frame-left-mask.png",
    width: 360,
    height: 503,
    box: [7.5, 23.459, 83.333, 62.425],
    rect: [50.263, 48.003, 84.473, 91.334],
    angle: 11.16,
    pivot: [48.6, 0],
  },
  middle: {
    image: "/images/frame-middle.png",
    mask: "/images/masks/frame-middle-mask.png",
    width: 340,
    height: 485,
    box: [10.588, 27.423, 79.118, 57.938],
    rect: [48.544, 49.238, 97.222, 93.774],
    angle: -6.16,
    pivot: [50, 0],
  },
  chainsaw: {
    image: "/images/chainsaw-frame.png",
    mask: "/images/masks/chainsaw-mask.png",
    width: 1536,
    height: 1024,
    box: [50.586, 43.75, 28.451, 49.805],
    rect: [49.716, 49.009, 82.807, 92.381],
    angle: -11.77,
  },
} satisfies Record<string, FrameGeo>;
