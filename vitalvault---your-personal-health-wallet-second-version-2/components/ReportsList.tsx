import { useEffect, useState } from "react";
import { getReports, shareReport } from "../services/reports";

export default function ReportsList() {
  const [reports, setReports] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getReports().then(setReports);
  }, []);

  return (
    <div>
      <h3>Your Reports</h3>

      {reports.map((r) => (
        <div key={r.id}>
          <p>{r.title}</p>

          <input
            placeholder="Share with email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={() => shareReport(r.id, email)}>
            Share
          </button>
        </div>
      ))}
    </div>
  );
}
