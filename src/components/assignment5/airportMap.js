import React from "react";
import { geoPath, geoMercator } from "d3-geo";
import { Routes } from './routes'
import { count } from "d3";


function AirportMap(props){
    const {width, height, countries, airports, routes, selectedAirlineID} = props;
 
    const projection = geoMercator()
        .scale(97)
        .translate([width / 2, height / 2 + 20]);

    const path = geoPath().projection(projection);

    const countriesPaths = countries.features.map((feature, index) => (
        <path
            key={`country-${index}`}
            d={path(feature)}
            stroke="#ccc"
            fill="#eee"
        />
    ));

    const airportsCircles = airports.map((airport, index) => (
        <circle
            key={index}
            cx={projection([airport.Longitude, airport.Latitude])[0]}
            cy={projection([airport.Longitude, airport.Latitude])[1]}
            r={1}
            fill="#2a5599"
        />
    ));

    return <g>
         <svg width={width} height={height} id="map">
            {countriesPaths}
            {airportsCircles}
        <Routes projection={projection} routes={routes} selectedAirlineID={selectedAirlineID}/>
        </svg>
    </g>
}
export { AirportMap }