import React from "react";
import { groupByCity } from "./utils";
import { forceSimulation, forceX, forceY, forceCollide, scaleLinear } from "d3";

function AirportBubble(props){
    const {width, height, routes, selectedAirline} = props;
    let cities, radiusScale, simulation;

    if (routes) {
        const filteredRoutes = selectedAirline ? routes.filter(route => route.AirlineID === selectedAirline) : routes;
        cities = groupByCity(filteredRoutes);

        cities.sort((a, b) => a.Count - b.Count);
      
        const maxCount = Math.max(...cities.map(city => city.Count));
        const minCount = Math.min(...cities.map(city => city.Count));
        radiusScale = scaleLinear()
            .domain([minCount, maxCount])
            .range([2, width * 0.15]);
      
        simulation = forceSimulation(cities)
            .velocityDecay(0.2)
            .force("x", forceX(width / 2).strength(0.02))
            .force("y", forceY(height / 2).strength(0.02))
            .force("collide", forceCollide(d => radiusScale(d.Count)))
            .stop();

        for (let i = 0; i < 200; ++i) simulation.tick(); 
    }

    return (
        <g>
            {cities && cities.map((city, idx) => {
                const isTopHub = idx >= cities.length - 5; 
                return (
                    <g key={idx}>
                        <circle
                            cx={city.x}
                            cy={city.y}
                            r={radiusScale(city.Count)}
                            fill={isTopHub ? "#ADD8E6" : "#2a5599"}
                            stroke="black"
                            strokeWidth="2"
                        />
                        {isTopHub && (
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
                                }}>
                                {city.City}
                            </text>
                        )}
                    </g>
                );
            })}
        </g>
    );
}

export { AirportBubble };