"use client";

import { useState } from "react";

/** Card on the dashboard home: one-time import of the site's current photos, video and text. */
export default function ImportDefaults() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const run = async () => {
    if (!confirm("Copy the website's current photos, video and text into the dashboard? This takes about a minute.")) return;
    setState("busy");
    setMsg("Importing… keep this tab open.");
    try {
      const res = await fetch("/api/import-defaults", { method: "POST", credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Failed (${res.status})`);
      setState("done");
      setMsg(`Done — ${json.photos} photos, the video and all text are now editable. Refresh to see them.`);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <div style={{ border: "1px solid var(--theme-elevation-150)", borderRadius: 8, padding: "20px 24px", marginBottom: 32, background: "var(--theme-elevation-50)" }}>
      <h3 style={{ margin: 0 }}>Welcome to the Mosh Rooms dashboard</h3>
      <p style={{ margin: "8px 0 0", opacity: 0.8 }}>
        Edit photos and the video under <strong>Album</strong> and <strong>Hero video</strong>; words and links under <strong>Text &amp; links</strong>. Saved changes show on the site within seconds.
      </p>
      {state !== "done" && (
        <p style={{ margin: "12px 0 0", opacity: 0.8 }}>First time here? Import what&apos;s on the website now so you start from the current photos instead of empty fields.</p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
        {state !== "done" && (
          <button type="button" className="btn btn--style-primary btn--size-medium" style={{ margin: 0 }} disabled={state === "busy"} onClick={run}>
            {state === "busy" ? "Importing…" : "Import current website content"}
          </button>
        )}
        {msg && <span style={{ color: state === "error" ? "#ff6b5e" : undefined }}>{msg}</span>}
      </div>
    </div>
  );
}
