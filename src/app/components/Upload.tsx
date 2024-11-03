"use client";

import { useState } from "react";
import styles from "./styles/upload.module.css";
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function Upload({
  onUploadComplete,
}: {
  onUploadComplete: (fileName: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const docRef = doc(db, "conversions", file.name);
      await setDoc(docRef, {
        fileName: uniqueFileName,
        status: "pending",
        createdAt: serverTimestamp()
      });
      const docId = docRef.id;
      const storageRef = ref(storage, `uploads/${file.name}`);
      const metadata = {
        contentType: file.type,
       customMetadata: { docId },
      };
      await uploadBytes(storageRef, file, metadata);
      console.log("File uploaded successfully with docId:", docId);

      onUploadComplete(file.name);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.title}>Upload Your File</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className={styles.uploadButton}
      >
        Upload
      </button>
    </div>
  );
}
