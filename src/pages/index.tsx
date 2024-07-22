// src/pages/index.tsx
"use client";

import React from "react";
import FileUpload from "../components/FileUpload";
import ConvertedFiles from "../components/ConvertedFiles";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>File Conversion App</h1>
      <FileUpload />
      <ConvertedFiles />
    </div>
  );
};

export default Home;
