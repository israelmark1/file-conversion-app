"use client";

import React, { useEffect, useState } from "react";
import { storage, ref } from "../lib/firebase";
import { getDownloadURL } from "firebase/storage";
import styles from "./styles/ConvertedFiles.module.css";

const ConvertedFiles: React.FC = () => {
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);

  const fetchConvertedFile = async (fileName: string) => {
    const fileRef = ref(storage, `converted-files/${fileName}`);
    const url = await getDownloadURL(fileRef);
    setConvertedFileUrl(url);
  };

  useEffect(() => {
    const lastUploadedFile = localStorage.getItem("lastUploadedFile");

    const startWebSocket = () => {
      const socket = new WebSocket("ws://localhost:3000/api/pubsub");

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = (event) => {
        const { filePath } = JSON.parse(event.data);
        const fileName = filePath.split("/").pop();
        if (fileName === lastUploadedFile) {
          console.log("Received message for the last uploaded file:", filePath);
          fetchConvertedFile(fileName);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return socket;
    };

    const socket = startWebSocket();

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className={styles.container}>
      <h2>Converted File</h2>
      {convertedFileUrl ? (
        <div className={styles.fileContainer}>
          <a
            href={convertedFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Download Converted File
          </a>
        </div>
      ) : (
        <p>No converted file available.</p>
      )}
    </div>
  );
};

export default ConvertedFiles;
