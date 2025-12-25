import { apiFetch, authHeader } from "./httpApi";

export async function uploadReport(title: string, file: File) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  const res = await fetch("http://localhost:5001/api/reports", {
    method: "POST",
    headers: authHeader(), // JWT here
    body: formData,
  });

  return res.json();
}

export function getReports() {
  return apiFetch("/api/reports");
}

export function shareReport(reportId: number, email: string) {
  return apiFetch("/api/reports/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportId, email }),
  });
}
