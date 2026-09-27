import "./App.css";
import init, { Ufdb } from "../wasm/pkg/wasm.js";
import { useEffect, useRef, useState } from "react";
import Contents from "./components/Contents.js";

function App() {
  const [key, setKey] = useState("");

  const ufdbRef = useRef<Ufdb | null>(null);

  useEffect(() => {
    init().then(() => {
      ufdbRef.current = new Ufdb();
    });
  }, []);

  const handleMakeSet = (key: string) => {
    const ufdb = ufdbRef.current;

    if (!ufdb) {
      return;
    }

    const res = ufdb.make_set(key);

    window.alert(`make_setの結果 : ${res}`);
  };

  return (
    <>
      <div
        style={{
          padding: "40px",
        }}
      >
        <h1>キーの挿入</h1>

        <form>

          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <button
            type="button"
            onClick={() => handleMakeSet(key)}
          >
            make_setの実行
          </button>
        </form>

      </div>

      <Contents />
    </>
  );

  //   <section id="center">
  //     {!wasmReady && (
  //       <p>Now Loading...</p>
  //     )}

  //     <Header
  //       isSidebarOpen={false}
  //       onToggleSidebar={() => console.log("open")}
  //     />

  //     <p>
  //       最終build : {new Date(__BUILD_TIME__).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
  //     </p>
  //     {wasmReady && (
  //       <>

  //         <p>Count : {count}</p>

  //         <button onClick={handleClick}>+1</button>
  //       </>
  //     )}
  //   </section>
  // );
}

export default App;
