"use client";

import { useEffect, useState } from "react";
import styles from "./styles/Download.module.css";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function Download({ fileName }: { fileName: string }) {
  const [status, setStatus] = useState("Pending");
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, "conversions", fileName);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(data.status);
        if (data.status === "completed") {
          setDownloadLink(data.pdfUrl);
          console.log("Download link:", data.pdfUrl);
        } else if (data.status === "error") {
          console.log("Error:", data.error);
          setStatus("Error");
        }
      }
    });

    return () => unsubscribe();
  }, [fileName]);
  return (
    <div className={styles.downloadContainer}>
      <h1 className={styles.title}>Download Your Converted File</h1>
      {status === "pending" && (
        <p className={styles.loadingText}>Waiting for processing to start...</p>
      )}
      {status === "processing" && (
        <p className={styles.loadingText}>Processing your file...</p>
      )}
      {status === "completed" && downloadLink && (
        <a href={downloadLink} download className={styles.downloadLink}>
          Download File
        </a>
      )}
      {status === "error" && (
        <p className={styles.errorText}>
          An error occurred during file processing.
        </p>
      )}
    </div>
  );
}
