import Image from "next/image";
import type { Photo } from "@/content/site";
import type { FrameGeo } from "@/lib/frames";
import { PhotoButton } from "./gallery";

/**
 * A frame PNG with a photo sitting *behind* it, cropped to the frame's exact window shape
 * (CSS mask) and tilted to match the frame — so the torn, blood-stained border overlaps the photo
 * like a real print. Fills its parent; the parent sets size/position.
 */
export function FramedPhoto({ geo, photo, index, photoSizes, frameSizes }: { geo: FrameGeo; photo: Photo; index: number; photoSizes: string; frameSizes: string }) {
  const [bx, by, bw, bh] = geo.box;
  const [cx, cy, rw, rh] = geo.rect;
  const mask = `url(${geo.mask})`;
  return (
    <div className="absolute inset-0">
      <div
        className="absolute"
        style={{ left: `${bx}%`, top: `${by}%`, width: `${bw}%`, height: `${bh}%`, maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", maskRepeat: "no-repeat" }}
      >
        <div className="absolute" style={{ left: `${cx - rw / 2}%`, top: `${cy - rh / 2}%`, width: `${rw}%`, height: `${rh}%`, rotate: `${geo.angle}deg` }}>
          <Image src={photo.src} alt={photo.alt} fill sizes={photoSizes} className="object-cover" />
        </div>
      </div>
      <Image src={geo.image} alt="" fill sizes={frameSizes} className="pointer-events-none select-none object-cover" draggable={false} />
      <PhotoButton index={index} label={`Open photo: ${photo.alt}`} className="absolute" style={{ left: `${bx}%`, top: `${by}%`, width: `${bw}%`, height: `${bh}%`, rotate: `${geo.angle}deg` }} />
    </div>
  );
}
