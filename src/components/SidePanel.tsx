import type { ReactNode } from "react";

import styles from "./sidePanel.module.css";

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export default function SidePanel({
  isOpen,
  children,
}: Props) {
  return (
    <aside
      className={`${styles.sidePanel} ${isOpen ? "" : styles.closed}`}
    >
      {children}
    </aside>
  );
}
