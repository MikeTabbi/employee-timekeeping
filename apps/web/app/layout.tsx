export const metadata = { title: "Timekeeping", description: "Employee kiosk + dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>⏱️ Timekeeping</h1>
            <nav style={{ display: "flex", gap: 12 }}>
              <a href="/clock">Kiosk</a>
              <a href="/me">My Timesheet</a>
              <a href="/admin/timesheets">Admin</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
