"use client";

import React, { useState } from "react";
import { storage, ref } from "../lib/firebase";
import { uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import styles from "./styles/FileUpload.module.css";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(false); 

  async function handleUpload() {
    if (file) {
      setProgress(true);
      const storageRef = ref(storage, `files-to-convert/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {},
        (error: Error) => {
          console.error("Upload error: ", error);
          setProgress(false)
        },
        async () => {
          console.log("File uploaded successfully!");

          try {
            const response = await fetch('/api/publishMessage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fileName: file.name }),
            });

            const data = await response.json();
            if (response.ok) {
              console.log(data.message);
              localStorage.setItem("lastUploadedFile", file.name);
            } else {
              console.error(data.error);
            }
          } catch (error) {
            console.error("Error calling API: ", error);
          }
          setProgress(false);
        }
      );
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className={styles.input}
      />
      <button
        onClick={handleUpload}
        className={`${styles.button} ${progress ? styles.uploading : ""}`}
        disabled={progress}
      >
        {progress ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;
