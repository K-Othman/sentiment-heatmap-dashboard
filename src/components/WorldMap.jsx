import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import * as d3 from "d3";
import { getSentimentColor } from "../utils/sentimentUtils";
import ReactTooltip from "react-tooltip";

// ✅ GeoJSON with country names
const geoUrl =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

// ✅ Alias map for country name mismatches
const nameAliases = {
  "United States of America": "United States",
  Russia: "Russian Federation",
  "South Korea": "Korea, Republic of",
  "North Korea": "Korea, Democratic People's Republic of",
  Vietnam: "Viet Nam",
  Iran: "Iran, Islamic Republic of",
  Syria: "Syrian Arab Republic",
  "Czech Republic": "Czechia",
  "Republic of the Congo": "Congo",
  "Democratic Republic of the Congo": "Democratic Republic of the Congo",
  "Ivory Coast": "Côte d'Ivoire",
  Tanzania: "United Republic of Tanzania",
  Bolivia: "Bolivia (Plurinational State of)",
  Venezuela: "Venezuela (Bolivarian Republic of)",
  Moldova: "Republic of Moldova",
};

const WorldMap = () => {
  const [sentimentData, setSentimentData] = useState({});
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    // Load sentiment data from CSV and compute average sentiment per country
    d3.csv("/src/data/geo_sentiments.csv").then((rawData) => {
      const countryTotals = {};

      rawData.forEach((row) => {
        const country = row.Country.trim();
        const score = parseFloat(row.RandomValue);

        if (!isNaN(score)) {
          if (!countryTotals[country]) {
            countryTotals[country] = { total: 0, count: 0 };
          }
          countryTotals[country].total += score;
          countryTotals[country].count += 1;
        }
      });

      // Calculate average sentiment per country
      const averagedSentiment = {};
      for (const country in countryTotals) {
        const { total, count } = countryTotals[country];
        averagedSentiment[country] = total / count;
      }

      setSentimentData(averagedSentiment);
    });
  }, []);

  return (
    <div className="map-container">
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Sentiment Heatmap
      </h2>

      <ComposableMap
        projectionConfig={{ scale: 140 }}
        width={980}
        height={500}
        style={{ width: "100%", height: "auto" }}
        data-tip=""
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const resolvedName = nameAliases[name] || name;
                const sentiment = sentimentData[resolvedName];

                //  Log countries that don't match any sentiment data
                if (sentiment === undefined) {
                  console.log("No data for:", resolvedName);
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setTooltipContent(
                        sentiment !== undefined
                          ? `${resolvedName}: ${sentiment.toFixed(2)}`
                          : `${resolvedName}: No data`
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
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip showing sentiment value on hover */}
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default WorldMap;
