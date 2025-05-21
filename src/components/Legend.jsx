import "../styles.css";

const Legend = () => {
  return (
    // Container for all legend items
    <div className="legend-container">
      {/* Negative sentiment range */}
      <div className="legend-item">
        <span
          className="legend-color"
          style={{ backgroundColor: "#F44336" }}
        ></span>
        <span className="legend-label">Negative (0–0.3)</span>
      </div>

      {/* Neutral sentiment range */}
      <div className="legend-item">
        <span
          className="legend-color"
          style={{ backgroundColor: "#FFEB3B" }}
        ></span>
        <span className="legend-label">Neutral (0.3–0.7)</span>
      </div>

      {/* Positive sentiment range */}
      <div className="legend-item">
        <span
          className="legend-color"
          style={{ backgroundColor: "#4CAF50" }}
        ></span>
        <span className="legend-label">Positive (0.7–1)</span>
      </div>
    </div>
  );
};

export default Legend;
