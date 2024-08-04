"use client";

import React, { useEffect, useState } from "react";
import { storage, ref } from "../lib/firebase";
import {
  listAll,
  getDownloadURL,
  ListResult,
  StorageReference,
} from "firebase/storage";
import styles from "./styles/ConvertedFiles.module.css";

const ConvertedFiles: React.FC = () => {
  const [convertedFiles, setConvertedFiles] = useState<string[]>([]);

  useEffect(() => {
    const storageRef = ref(storage, "convertedFiles");
    listAll(storageRef).then((result: ListResult) => {
      const filePromises = result.items.map((itemRef: StorageReference) =>
        getDownloadURL(itemRef)
      );
      Promise.all(filePromises).then((urls) => setConvertedFiles(urls));
    });
  }, []);

  return (
    <div className={styles.container}>
      <h2>Converted Files</h2>
      <ul className={styles.list}>
        {convertedFiles.map((url, index) => (
          <li key={index} className={styles.listItem}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConvertedFiles;
