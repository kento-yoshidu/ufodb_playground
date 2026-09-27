import type { Dispatch, SetStateAction } from "react";

import styles from "./sidePanel.module.css";

type Props = {
  isOpen: boolean;
  keyValue: string;
  setKey: Dispatch<SetStateAction<string>>;
  keyA: string;
  setKeyA: Dispatch<SetStateAction<string>>;
  keyB: string;
  setKeyB: Dispatch<SetStateAction<string>>;
  insert: () => void;
  handleMerge: () => void;
};

export default function SidePanel({
  isOpen,
  keyValue,
  setKey,
  keyA,
  setKeyA,
  keyB,
  setKeyB,
  insert,
  handleMerge,
}: Props) {
  return (
    <aside
      className={`${styles.sidePanel} ${isOpen ? "" : styles.closed}`}
    >
      <section className="panel">
        <h2 className="panel__title">キーを追加</h2>
        <form
          className={styles.row}
          onSubmit={(e) => {
            e.preventDefault();
            insert();
          }}
        >
          <input
            value={keyValue}
            onChange={(e) => setKey(e.currentTarget.value)}
            placeholder="Enter a key..."
          />
          <button type="submit">Insert</button>
        </form>
      </section>

      <section className="panel">
        <div className={styles.detailsContent}>
          <input
            value={keyA}
            onChange={(e) => setKeyA(e.currentTarget.value)}
            placeholder="Enter a key..."
          />

          <input
            value={keyB}
            onChange={(e) => setKeyB(e.currentTarget.value)}
            placeholder="Enter a key..."
          />

          <button
            type="button"
            onClick={handleMerge}
          >
            Merge
          </button>
        </div>
      </section>
    </aside>
  );
}
