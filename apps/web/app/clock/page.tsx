"use client";
import { useState } from "react";

type PunchType = "IN" | "OUT" | "BREAK_START" | "BREAK_END";

export default function ClockPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState<"OFF" | "IN" | "BREAK">("OFF");
  const [msg, setMsg] = useState("");

  async function punch(type: PunchType) {
    setMsg("Submitting...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/time/punch`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ employeeId, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setMsg(`Success: ${type} at ${new Date(data.timestamp).toLocaleTimeString()}`);
      if (type === "IN") setStatus("IN");
      if (type === "OUT") setStatus("OFF");
      if (type === "BREAK_START") setStatus("BREAK");
      if (type === "BREAK_END") setStatus("IN");
    } catch (e: any) {
      setMsg("Error: " + e.message);
    }
  }

  return (
    <main>
      <h2>Kiosk</h2>
      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <label>
          Employee ID
          <input
            placeholder="demo-emp-1"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
          />
        </label>
        <div>Status: <b>{status}</b></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button disabled={!employeeId || status !== "OFF"} onClick={() => punch("IN")}>Clock In</button>
          <button disabled={!employeeId || status !== "IN"} onClick={() => punch("BREAK_START")}>Start Break</button>
          <button disabled={!employeeId || status !== "BREAK"} onClick={() => punch("BREAK_END")}>End Break</button>
          <button disabled={!employeeId || status === "OFF"} onClick={() => punch("OUT")}>Clock Out</button>
        </div>
        {msg && <div style={{ padding: 8, background: "#f6f6f6", borderRadius: 8 }}>{msg}</div>}
        <p style={{ fontSize: 12, color: "#666" }}>
          Set <code>NEXT_PUBLIC_API_URL</code> in <code>.env.local</code> (e.g., http://localhost:4000)
        </p>
      </div>
    </main>
  );
}
