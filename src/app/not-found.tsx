import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-black px-6 text-center">
      <Image src="/images/gallery-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-70" />
      <div className="relative">
        <div className="anim-float relative mx-auto h-56 w-48">
          <Image src="/images/ghost-large.png" alt="" fill sizes="192px" className="object-contain" />
        </div>
        <h1 className="font-display mt-4 text-7xl text-bone">404</h1>
        <p className="mt-2 text-lg text-bone/80">This room is empty. The pit is back this way.</p>
        <Link href="/" className="cta mt-8">
          Back to Mosh Rooms
        </Link>
      </div>
    </main>
  );
}
