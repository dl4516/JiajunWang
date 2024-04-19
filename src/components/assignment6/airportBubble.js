import React from "react";
import { groupByCity } from "./utils";
import { forceSimulation, forceX, forceY, forceCollide, scaleLinear } from "d3";
import { min, max } from 'd3-array';

function AirportBubble(props) {
  const { width, height, routes, selectedAirline } = props;
  console.log(groupByCity(routes));
  const renderBubbles = (cityArray) => {
    
    const radiusScale = scaleLinear()
      .range([2, width * 0.15])
      .domain([min(cityArray, d => d.Count), max(cityArray, d => d.Count)]);

    
    const simulation = forceSimulation(cityArray)
      .velocityDecay(0.2)
      .force("x", forceX(width / 2).strength(0.02))
      .force("y", forceY(height / 2).strength(0.02))
      .force("collide", forceCollide(d => radiusScale(d.Count)))
      .tick(200);

    
    cityArray.forEach(city => {
      city.x = simulation.find(city.x, city.y).x;
      city.y = simulation.find(city.x, city.y).y;
    });

    return cityArray.map((city, idx) => {
      const isTopHub = idx >= cityArray.length - 5;
      const fillColor = isTopHub ? "#ADD8E6" : "#2a5599";
      const textElement = isTopHub ? (
        <text
          x={city.x}
          y={city.y}
          style={{
            textAnchor: "middle",
            stroke: "pink",
            strokeWidth: "0.5em",
            fill: "#992a2a",
            fontSize: 16,
            fontFamily: "cursive",
            paintOrder: "stroke",
            strokeLinejoin: "round"
          }}
        >
          {city.City}
        </text>
      ) : null;

      return (
        <g key={idx}>
          <circle
            cx={city.x}
            cy={city.y}
            r={radiusScale(city.Count)}
            fill={fillColor}
            stroke="black"
            strokeWidth="2"
          />
          {textElement}
        </g>
      );
    });
  };

  
  const handleSelectedAirline = () => {
    let selectedRoutes = routes.filter(a => a.AirlineID === selectedAirline);
    let cities = groupByCity(selectedRoutes).sort((a, b) => a.Count - b.Count);
    return renderBubbles(cities);
  };

  
  const handleNoSelectedAirline = () => {
    let cities = groupByCity(routes).sort((a, b) => a.Count - b.Count);
    return renderBubbles(cities);
  };

  return (
    <g>
      {selectedAirline ? handleSelectedAirline() : handleNoSelectedAirline()}
    </g>
  );
}

export { AirportBubble };