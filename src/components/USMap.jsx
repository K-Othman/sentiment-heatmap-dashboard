import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { getSentimentColor } from "../utils/sentimentUtils";
import ReactTooltip from "react-tooltip";

// US states topojson
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const USMap = () => {
  const [usGeoData, setUsGeoData] = useState(null);
  const [sentimentData, setSentimentData] = useState({});
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    // Convert TopoJSON to GeoJSON
    d3.json(geoUrl).then((topoData) => {
      const geo = feature(topoData, topoData.objects.states);
      setUsGeoData(geo);
    });

    // Load sentiment data
    d3.csv("/src/data/geo_sentiments.csv").then((rawData) => {
      const stateSentiment = {};

      rawData.forEach((row) => {
        const country = row.Country.trim();
        const region = row.Region.trim();
        const score = parseFloat(row.RandomValue);

        if (country === "United States" && !isNaN(score)) {
          if (!stateSentiment[region]) {
            stateSentiment[region] = { total: 0, count: 0 };
          }
          stateSentiment[region].total += score;
          stateSentiment[region].count += 1;
        }
      });

      const averageSentiment = {};
      for (const state in stateSentiment) {
        const { total, count } = stateSentiment[state];
        averageSentiment[state] = total / count;
      }

      setSentimentData(averageSentiment);
    });
  }, []);

  // US state names lookup
  const stateNames = {
    1: "Alabama",
    2: "Alaska",
    4: "Arizona",
    5: "Arkansas",
    6: "California",
    8: "Colorado",
    9: "Connecticut",
    10: "Delaware",
    11: "District of Columbia",
    12: "Florida",
    13: "Georgia",
    15: "Hawaii",
    16: "Idaho",
    17: "Illinois",
    18: "Indiana",
    19: "Iowa",
    20: "Kansas",
    21: "Kentucky",
    22: "Louisiana",
    23: "Maine",
    24: "Maryland",
    25: "Massachusetts",
    26: "Michigan",
    27: "Minnesota",
    28: "Mississippi",
    29: "Missouri",
    30: "Montana",
    31: "Nebraska",
    32: "Nevada",
    33: "New Hampshire",
    34: "New Jersey",
    35: "New Mexico",
    36: "New York",
    37: "North Carolina",
    38: "North Dakota",
    39: "Ohio",
    40: "Oklahoma",
    41: "Oregon",
    42: "Pennsylvania",
    44: "Rhode Island",
    45: "South Carolina",
    46: "South Dakota",
    47: "Tennessee",
    48: "Texas",
    49: "Utah",
    50: "Vermont",
    51: "Virginia",
    53: "Washington",
    54: "West Virginia",
    55: "Wisconsin",
    56: "Wyoming",
  };

  return (
    <div className="map-container">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        U.S. State Sentiment Heatmap
      </h2>

      <ComposableMap
        projection="geoAlbersUsa"
        width={980}
        height={550}
        data-tip=""
      >
        <ZoomableGroup>
          {usGeoData && (
            <Geographies geography={usGeoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = stateNames[geo.id];
                  const sentiment = sentimentData[stateName];

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setTooltipContent(
                          sentiment !== undefined
                            ? `${stateName}: ${sentiment.toFixed(2)}`
                            : `${stateName}: No data`
                        );
                      }}
                      onMouseLeave={() => setTooltipContent("")}
                      fill={
                        sentiment !== undefined
                          ? getSentimentColor(sentiment)
                          : "#DDD"
                      }
                      stroke="#FFF"
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#999", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>

      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default USMap;
