/** Big logo on the dashboard login screen. */
export default function Logo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- admin UI, static asset */}
      <img src="/images/mosh-rooms-logo.png" alt="Mosh Rooms" width={240} height={160} style={{ objectFit: "contain" }} />
      <span style={{ fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>Website dashboard</span>
    </div>
  );
}
