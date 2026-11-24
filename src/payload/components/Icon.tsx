/** Small logo in the dashboard sidebar / header. */
export default function Icon() {
  // eslint-disable-next-line @next/next/no-img-element -- admin UI, static asset
  return <img src="/icon.png" alt="Mosh Rooms" width={28} height={28} style={{ borderRadius: 4 }} />;
}
