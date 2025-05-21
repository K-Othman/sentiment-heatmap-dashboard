import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import * as d3 from "d3";

// URL to world map TopoJSON (no need to host yourself)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/src/data/geo_sentiments.csv")
      .then((rawData) => {
        setData(rawData);
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
      });
  }, []);

  return (
    <div className="map-container">
      <ComposableMap
        projectionConfig={{
          scale: 140,
        }}
        width={980}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#DDD" // we will color this dynamically later
                  stroke="#FFF"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#999", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
