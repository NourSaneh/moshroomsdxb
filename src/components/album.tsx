import Image from "next/image";
import type { Photo } from "@/content/site";
import type { SiteContent } from "@/lib/content";
import { frames } from "@/lib/frames";
import { box, inner, sizes } from "@/lib/stage";
import { ChainCarousel } from "./chain-carousel";
import { FramedPhoto } from "./framed-photo";
import { GalleryProvider } from "./gallery";
import { Layer, RotLayer, StageSection } from "./stage";

type AlbumProps = { photos: Photo[]; album: SiteContent["album"] };

/** Wireframe 2 — the album wall. Desktop/tablet: the Figma collage. Phones: a stacked version. */
export function Album({ photos, album }: AlbumProps) {
  return (
    <GalleryProvider photos={photos}>
      <div id="album" className="scroll-mt-0">
        <AlbumStage photos={photos} album={album} />
        <AlbumMobile photos={photos} album={album} />
      </div>
    </GalleryProvider>
  );
}

function AlbumStage({ photos, album }: AlbumProps) {
  const stripItems = album.strip.map((index) => ({ index, photo: photos[index] }));
  const left = frames.left;
  const middle = frames.middle;
  const saw = frames.chainsaw;
  return (
    <StageSection
      id="album-wall"
      label="Album"
      className="album-stage hidden bg-black md:block"
      background={
        <>
          <Image src="/images/gallery-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div className="top-chain" aria-hidden />
        </>
      }
    >
      <h2 className="sr-only">Album</h2>

      {/* middle hanging frame */}
      <div className="pointer-events-none absolute anim-swing anim-swing-slow" style={{ ...box(473, 38, 340, 485), transformOrigin: `${middle.pivot[0]}% ${middle.pivot[1]}%` }} data-swing="1" data-swing-period="1.7" data-swing-dir="-1">
        <FramedPhoto geo={middle} photo={photos[album.middleFrame]} index={album.middleFrame} photoSizes={sizes(270)} frameSizes={sizes(340)} />
      </div>

      {/* chainsaw with the hanging right frame */}
      <div className="pointer-events-none absolute flex items-center justify-center" style={{ ...box(531, 38, 948.949, 651.012), transformOrigin: "91% 0" }} data-swing="0.5" data-swing-period="2.1">
        <div className="relative flex-none" style={inner(948.949, 651.012, 927.485, 618.323, -2.04)}>
          <FramedPhoto geo={saw} photo={photos[album.chainsawFrame]} index={album.chainsawFrame} photoSizes={sizes(250)} frameSizes={sizes(928)} />
        </div>
      </div>

      {/* left hanging frame */}
      <div className="pointer-events-none absolute anim-swing" style={{ ...box(91, 29, 360, 503), transformOrigin: `${left.pivot[0]}% ${left.pivot[1]}%` }} data-swing="1" data-swing-period="1.4">
        <FramedPhoto geo={left} photo={photos[album.leftFrame]} index={album.leftFrame} photoSizes={sizes(280)} frameSizes={sizes(360)} />
      </div>

      <RotLayer src="/images/ghost-large.png" x={730} y={320} w={303.356} h={335.144} iw={271} ih={307} deg={-6.36} className="anim-float" />
      <RotLayer src="/images/eye-strip.png" x={98} y={532} w={380.369} h={163.977} iw={375} ih={150} deg={2.15} />
      <ChainCarousel items={stripItems} className="absolute" style={box(98, 636, 1234, 411)} />

      <Layer src="/images/red-scribble.png" x={1275} y={202} w={103} h={192} />
      <Layer src="/images/red-star-small.png" x={559} y={544} w={145} h={140} />
      <RotLayer src="/images/red-star-large.png" x={28} y={38} w={125.628} h={170.685} iw={119} ih={166} deg={-177.68} className="anim-spin" />
    </StageSection>
  );
}

function AlbumMobile({ photos, album }: AlbumProps) {
  const stripItems = album.strip.map((index) => ({ index, photo: photos[index] }));
  const cards = [
    { geo: frames.left, idx: album.leftFrame, tilt: "-2deg" },
    { geo: frames.middle, idx: album.middleFrame, tilt: "2deg" },
  ];
  return (
    <section aria-label="Album" className="album-mobile relative overflow-hidden bg-black px-5 pb-14 pt-16 md:hidden">
      <Image src="/images/gallery-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-80" />
      <div className="top-chain" aria-hidden />
      <h2 className="font-display relative mb-2 text-center text-5xl text-bone">Album</h2>

      <div className="relative mx-auto grid max-w-sm grid-cols-2 gap-x-2">
        {cards.map((c, i) => (
          <div
            key={i}
            className="relative anim-swing"
            style={{ aspectRatio: `${c.geo.width}/${c.geo.height}`, transformOrigin: "50% 0", ["--tilt" as string]: c.tilt, animationDelay: `${-i * 2}s` }}
            data-swing="1"
            data-swing-period={i ? "1.7" : "1.4"}
            data-swing-dir={i ? "-1" : "1"}
          >
            <FramedPhoto geo={c.geo} photo={photos[c.idx]} index={c.idx} photoSizes="40vw" frameSizes="50vw" />
          </div>
        ))}
      </div>

      <div className="relative -mt-4" style={{ aspectRatio: "1536/1024", transformOrigin: "91% 0" }} data-swing="0.5" data-swing-period="2.1">
        <FramedPhoto geo={frames.chainsaw} photo={photos[album.chainsawFrame]} index={album.chainsawFrame} photoSizes="30vw" frameSizes="100vw" />
        <div className="anim-float absolute bottom-[4%] left-[2%] w-[34%]" style={{ aspectRatio: "271/307" }}>
          <Image src="/images/ghost-large.png" alt="" fill sizes="34vw" className="object-contain" />
        </div>
      </div>

      <div className="relative mx-auto mt-2 w-[92%]" style={{ aspectRatio: "375/150", rotate: "2deg" }}>
        <Image src="/images/eye-strip.png" alt="" fill sizes="92vw" className="object-cover" />
      </div>

      <ChainCarousel items={stripItems} className="relative -mx-5 mt-6" style={{ aspectRatio: "1234/411", width: "calc(100% + 2.5rem)" }} />
    </section>
  );
}
