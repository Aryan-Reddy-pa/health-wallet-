import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import reportsRoutes from "./routes/reports.routes.js";
import vitalsRoutes from "./routes/vitals.routes.js";


const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Auth routes (public + login)
app.use("/api/auth", authRoutes);

// Reports routes (JWT protected internally)
app.use("/api/reports", reportsRoutes);

app.use("/api/vitals", vitalsRoutes);


// Health check (always last)
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});