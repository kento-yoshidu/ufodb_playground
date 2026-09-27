import { useState } from "react";
import { Header } from "ufodb-design-system";
import styles from "./contents.module.css";
import SidePanel from "./SidePanel";

export default function Contents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [key, setKey] = useState("");

  const [keyA, setKeyA] = useState("");
  const [keyB, setKeyB] = useState("");

  async function insert() {
    console.log("insert");
  }

  const handleMerge = async () => {
    console.log("merge");
  };

  return (
    <div className={styles.wrapper}>
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <main className={styles.main}>
        <SidePanel
          isOpen={isSidebarOpen}
          keyValue={key}
          setKey={setKey}
          keyA={keyA}
          setKeyA={setKeyA}
          keyB={keyB}
          setKeyB={setKeyB}
          insert={insert}
          handleMerge={handleMerge}
        />

        <p>サイド</p>
      </main>
    </div>
  );
}
