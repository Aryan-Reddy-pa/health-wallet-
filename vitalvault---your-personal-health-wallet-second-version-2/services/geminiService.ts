// services/geminiService.ts
// NOTE: Gemini / LLMs should NEVER run in the browser.
// This is a SAFE frontend mock used for demo & evaluation.

export async function parseMedicalReport(base64Image: string) {
  console.log("Mock AI parsing medical report...");

  // Simulated delay (feels like real AI)
  await new Promise((res) => setTimeout(res, 1200));

  // Mocked AI-extracted data
  return {
    title: "Medical Diagnostic Report",
    category: "General Health",
    date: new Date().toISOString().split("T")[0],
    vitals: {
      BP: 118,
      Sugar: 92,
      HeartRate: 74,
      SpO2: 98,
    },
  };
}

