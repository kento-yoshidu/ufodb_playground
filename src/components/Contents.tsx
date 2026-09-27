import { useState } from "react";
import { Header, InsertKeyForm, MergeForm } from "ufodb-design-system";
import styles from "./contents.module.css";
import SidePanel from "./SidePanel";

type Props = {
  onInsert: (key: string) => void;
  onMerge: (keyA: string, keyB: string) => void;
};

export default function Contents({
  onInsert,
  onMerge,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.wrapper}>
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <main className={styles.main}>
        <SidePanel
          isOpen={isSidebarOpen}
        >
          <InsertKeyForm
            onSubmit={onInsert}
          />

          <MergeForm
            onSubmit={onMerge}
          />
        </SidePanel>

        <p>main</p>
      </main>
    </div>
  );
}
