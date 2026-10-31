import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ufdb } from "../wasm/pkg/wasm.js";
import Contents from "./components/Contents.js";
import type { GraphData } from "ufodb-design-system";

type Props = {
  ufdb: Ufdb;
};

function App({
  ufdb,
}: Props) {
  const queryClient = useQueryClient();

  const { data: groups = [] } = useQuery({
    queryKey: ["ufdb", "groups"],
    queryFn: () => ufdb.groups(),
  });

  const [graph, setGraph] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  const handleInsert = (key: string) => {
    ufdb.make_set(key);

    queryClient.invalidateQueries({ queryKey: ["ufdb"]});
    setGraph(ufdb.graph());
  };

  const handleMerge = (keyA: string, keyB: string) => {
    ufdb.merge(keyA, keyB);

    queryClient.invalidateQueries({ queryKey: ["ufdb"]});
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
