import { useState } from "react";
import {
  Groups,
  Header,
  InsertKeyForm,
  MenuPanel,
  MergeForm,
  type Action,
  type Mode,
} from "ufodb-design-system";
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
  const [mode, setMode] = useState<Mode>("row");
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const [activeAction, setActiveAction] = useState<Action | null>(null);

  const [sameResult, setSameResult] = useState<string | null>(null);

  const selectAction = (action: Action | null) => {
    setActiveAction(action);
    setSameResult(null);
  };

  return (
    <div className={styles.wrapper}>
      <Header
        isSidebarOpen={isMenuOpen}
        onToggleSidebar={() => setIsMenuOpen((open) => !open)}
      />

      <main className={styles.main}>
        {mode === "row" ? (
          <div className={styles.right}>
            {groups.length > 0 && (
              <Groups
                groups={groups}
              />
            )}
          </div>
        ) : (
          <div className={styles.graph}>
            <p>comming soon...</p>
          </div>
        )}
      </main>

      {isMenuOpen && (
        <MenuPanel
          active={activeAction}
          onSelect={selectAction}
          mode={mode}
          onChangeMode={setMode}
        >
          {activeAction === "insert" && (
            <InsertKeyForm
              onSubmit={onInsert}
            />
          )}

          {activeAction === "merge" && (
            <MergeForm
              options={groups}
              onSubmit={onMerge}
            />
          )}

          {activeAction === "same" && (
            <p>comming soon...</p>
            // <>
            //   <SameForm
            //     onSubmit={handleSame}
            //   />

            //   {sameResult && <p className={menuStyles.result}>{sameResult}</p>}
            // </>
          )}
        </MenuPanel>
      )}
    </div>
  );
}
