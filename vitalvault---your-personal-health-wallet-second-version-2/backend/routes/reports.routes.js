import express from "express";
import multer from "multer";
import { db } from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ---------------- MULTER SETUP ---------------- */

const storage = multer.diskStorage({
  destination: "uploads/reports",
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------------- UPLOAD REPORT ---------------- */

router.post("/", auth, upload.single("file"), (req, res) => {
  const { title } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  db.run(
    "INSERT INTO reports (title, file_type, file_path, owner_id) VALUES (?, ?, ?, ?)",
    [title, file.mimetype, file.path, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Report uploaded", reportId: this.lastID });
    }
  );
});

/* ---------------- SHARE REPORT ---------------- */

router.post("/share", auth, (req, res) => {
  const { reportId, email } = req.body;

  if (!reportId || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Check ownership
  db.get(
    "SELECT id FROM reports WHERE id = ? AND owner_id = ?",
    [reportId, req.user.id],
    (err, report) => {
      if (!report) {
        return res.status(403).json({ error: "Not your report" });
      }

      // Find user by email
      db.get(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, user) => {
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          // Grant access
          db.run(
            "INSERT INTO access_control (report_id, shared_with) VALUES (?, ?)",
            [reportId, user.id],
            () => {
              res.json({ message: "Report shared successfully" });
            }
          );
        }
      );
    }
  );
});

/* ---------------- GET VISIBLE REPORTS ---------------- */

router.get("/", auth, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT r.*
    FROM reports r
    WHERE r.owner_id = ?

    UNION

    SELECT r.*
    FROM reports r
    JOIN access_control a ON r.id = a.report_id
    WHERE a.shared_with = ?
  `;

  db.all(query, [userId, userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/* ---------------- EXPORT (LAST LINE ONLY) ---------------- */

export default router;

