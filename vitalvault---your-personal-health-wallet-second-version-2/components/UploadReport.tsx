import { useState } from "react";
import { uploadReport } from "../services/reports";

export default function UploadReport() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    await uploadReport(title, file);
    alert("Report uploaded successfully");
  };

  return (
    <div>
      <input
        placeholder="Report title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
