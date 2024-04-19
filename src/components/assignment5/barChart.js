import React , { useState } from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";


export function BarChart (props) {
    const {offsetX, offsetY, data, height, width, selectedAirlineID, setSelectedAirlineID} = props;

    const maxValue = Math.max(...data.map(d => d.Count));

    const xScale = scaleLinear()
        .domain([0, maxValue])
        .range([0,width]);
    const yScale = scaleBand()
        .domain(data.map(d => d.AirlineName))
        .range([0, height])
        .padding(0.2);

    const getFillColor = (d) => {
        return selectedAirlineID === d.AirlineID ? "#992a5b" : "#2a5599";
    };

    return (
        < g transform = {`translate(${offsetX},${offsetY})`}>
            {/* Plot horizontal bars */}
            {data.map((d, index) => (
                <rect key={index}
                      x={0}
                      y={yScale(d.AirlineName)}
                      width={xScale(d.Count)}
                      height={yScale.bandwidth()}
                      fill={getFillColor(d)}
                      stroke="black" 
                      strokeWidth="1" 
                      onMouseOver={() => setSelectedAirlineID(d.AirlineID)} 
                      onMouseOut={() => setSelectedAirlineID(null)}
                      
              />
            ))}

            {/* Translate the XAxis based on offsetY */}
            
                <XAxis xScale={xScale} height={height} width={width} />
            

            {/* Render the YAxis */}
            
                <YAxis yScale={yScale} height={height} offsetX={offsetX} />
           
</g>)

}