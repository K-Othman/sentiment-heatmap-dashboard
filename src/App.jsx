import { useState } from "react";
import WorldMap from "./components/WorldMap";
import USMap from "./components/USMap";
import Legend from "./components/Legend";
import "./styles.css";

function App() {
  // State to control which map is displayed (world or US)
  const [view, setView] = useState("world");

  return (
    <div className="App">
      {/* Buttons to toggle between World and U.S. views */}
      <div className="toggle-container">
        <button
          onClick={() => setView("world")}
          className={`toggle-button ${view === "world" ? "active" : ""}`}
        >
          🌍 World
        </button>
        <button
          onClick={() => setView("us")}
          className={`toggle-button ${view === "us" ? "active" : ""}`}
        >
          🇺🇸 U.S.
        </button>
      </div>

      {/* Legend explaining sentiment colors */}
      <Legend />

      {/* Conditionally render the selected map */}
      {view === "world" && <WorldMap />}
      {view === "us" && <USMap />}
    </div>
  );
}

export default App;
