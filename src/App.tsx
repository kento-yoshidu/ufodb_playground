import "./App.css";
import { useEffect, useRef } from "react";
import init, { Ufdb } from "../wasm/pkg/wasm.js";
import Contents from "./components/Contents.js";

function App() {
  const ufdbRef = useRef<Ufdb | null>(null);

  useEffect(() => {
    init().then(() => {
      ufdbRef.current = new Ufdb();
    });
  }, []);

  const handleInsert = (key: string) => {
    const ufdb = ufdbRef.current;

    if (!ufdb) {
      return;
    }

    const res = ufdb.make_set(key);

    window.alert(`make_setの結果 : ${res}`);
  };

  return (
    <Contents
      onInsert={handleInsert}
    />
  );
}

export default App;
