import { useEffect, useRef, useState } from "react";
import { Ufdb } from "../wasm/pkg/wasm.js";
import Contents from "./components/Contents.js";
import type { GraphData } from "ufodb-design-system";

function App() {
  const ufdbRef = useRef<Ufdb | null>(null);

  const [groups, setGroups] = useState<string[][]>([]);
  const [graph, setGraph] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    ufdbRef.current = new Ufdb();
  }, []);

  const handleInsert = (key: string) => {
    const ufdb = ufdbRef.current;

    if (!ufdb) {
      return;
    }

    ufdb.make_set(key);

    setGroups(ufdb.groups());
    setGraph(ufdb.graph());
  };

  const handleMerge = (keyA: string, keyB: string) => {
    const ufdb = ufdbRef.current;

    if (!ufdb) {
      return;
    }

    ufdb.merge(keyA, keyB);

    setGroups(ufdb.groups());
    setGraph(ufdb.graph());
  };

  return (
    <Contents
      onInsert={handleInsert}
      onMerge={handleMerge}
      groups={groups}
      graph={graph}
    />
  );
}

export default App;
