import { useState } from "react";
import { Groups, Header, InsertKeyForm, MergeForm } from "ufodb-design-system";
import SidePanel from "./SidePanel";
import styles from "./contents.module.css";

type Props = {
  onInsert: (key: string) => void;
  onMerge: (keyA: string, keyB: string) => void;
  groups: string[][];
};

export default function Contents({
  onInsert,
  onMerge,
  groups,
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

        <div className={styles.right}>
          {groups.length > 0 && (
            <Groups
              groups={groups}
            />
          )}
        </div>
      </main>
    </div>
  );
}
