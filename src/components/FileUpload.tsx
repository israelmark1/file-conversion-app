// src/components/FileUpload.tsx
"use client";

import React, { useState } from "react";
import { storage, ref } from "../lib/firebase";
import { uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import styles from "./FileUpload.module.css";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (file) {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {},
        (error: Error) => {
          console.error("Upload error: ", error);
        },
        () => {
          console.log("File uploaded successfully!");
        }
      );
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className={styles.input}
      />
      <button onClick={handleUpload} className={styles.button}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
