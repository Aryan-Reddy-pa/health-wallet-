import { useEffect, useState } from "react";
import { getVitals } from "../services/vitals";
import VitalsCharts from "./VitalsCharts";
import { VitalRecord } from "../types";

export default function VitalsDashboard() {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVitals()
      .then((data) => setVitals(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-400">Loading vitals…</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VitalsCharts
        data={vitals}
        type="BP"
        color="#ef4444"
        title="Blood Pressure"
      />

      <VitalsCharts
        data={vitals}
        type="Sugar"
        color="#22c55e"
        title="Blood Sugar"
      />

      <VitalsCharts
        data={vitals}
        type="HR"
        color="#3b82f6"
        title="Heart Rate"
      />
    </div>
  );
}
