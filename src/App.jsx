import { useState } from "react";
import WorldMap from "./components/WorldMap";
import USMap from "./components/USMap";
import Legend from "./components/Legend";
import "./styles.css";

function App() {
  const [view, setView] = useState("world");

  return (
    <div className="App">
      <div className="toggle-container">
        <button
          onClick={() => setView("world")}
          className={`toggle-button ${view === "world" ? "active" : ""}`}
        >
          🌍 World Map
        </button>

        <button
          onClick={() => setView("us")}
          className={`toggle-button ${view === "us" ? "active" : ""}`}
        >
          🇺🇸 U.S. Map
        </button>
      </div>

      <Legend />

      {view === "world" && <WorldMap />}
      {view === "us" && <USMap />}
    </div>
  );
}

export default App;
