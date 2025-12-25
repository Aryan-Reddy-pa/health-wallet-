import express from "express";
import { db } from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Add a vital reading
 * Body:
 * {
 *   vital_type: "BP" | "SUGAR" | "HR",
 *   value: "120/80" | "95" | "72",
 *   date: "2025-01-25"
 * }
 */
router.post("/", auth, (req, res) => {
  const { vital_type, value, date } = req.body;

  if (!vital_type || !value || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.run(
    `INSERT INTO vitals (user_id, vital_type, value, date)
     VALUES (?, ?, ?, ?)`,
    [req.user.id, vital_type, value, date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Vital recorded", id: this.lastID });
    }
  );
});

/**
 * Fetch all vitals for logged-in user
 */
router.get("/", auth, (req, res) => {
  db.all(
    `SELECT vital_type, value, date
     FROM vitals
     WHERE user_id = ?
     ORDER BY date ASC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

export default router;
