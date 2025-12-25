import { apiFetch } from "./httpApi";

export function addVital(
  vital_type: string,
  value: number,
  date: string
) {
  return apiFetch("/api/vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vital_type, value, date }),
  });
}

export function getVitals() {
  return apiFetch("/api/vitals");
}
