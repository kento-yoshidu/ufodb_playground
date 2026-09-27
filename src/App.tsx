import "./App.css";
import { Header } from "ufodb-design-system";
import init, { Counter } from "../wasm/pkg/wasm.js";
import { useEffect, useRef, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const [wasmReady, setWasmReady] = useState(false);
  const counterRef = useRef<Counter | null>(null);

  useEffect(() => {
    init().then(() => {
      counterRef.current = new Counter();
      setWasmReady(true);
    });
  }, []);

  const handleClick = () => {
    const counter = counterRef.current;

    if (!counter) {
      return;
    }

    counter.increment();
    setCount(counter.value());
  };

  return (
    <section id="center">
      {!wasmReady && (
        <p>Now Loading...</p>
      )}

      <Header
        isSidebarOpen={false}
        onToggleSidebar={() => console.log("open")}
      />

      <p>
        最終build : {new Date(__BUILD_TIME__).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
      </p>
      {wasmReady && (
        <>

          <p>Count : {count}</p>

          <button onClick={handleClick}>+1</button>
        </>
      )}
    </section>
  );
}

export default App;
