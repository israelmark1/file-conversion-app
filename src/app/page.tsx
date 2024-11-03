// app/page.tsx
"use client";

import { useState } from "react";
import Upload from "./components/Upload";
import Download from "./components/Download";

export default function HomePage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUploadComplete = (uploadedFileName: string) => {
    setFileName(uploadedFileName);
    setIsUploaded(true);
  };

  return (
    <div>
      {isUploaded && fileName ? (
        <Download fileName={fileName} />
      ) : (
        <Upload onUploadComplete={handleUploadComplete} />
      )}
    </div>
  );
}
