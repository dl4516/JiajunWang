import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";

function App() {
  const [year, setYear] = useState("1970");
  const [rawData, setRawData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [gdpData, setGdpData] = useState([]);

  const width = 600;
  const height = 400;

  // 创建提示工具
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const renderMap = (features, rawData, year, gdpData) => {
    const svgMap = d3.select("#map");
    svgMap.selectAll("*").remove();
    const projection = d3.geoNaturalEarth1();
    const pathGenerator = d3.geoPath().projection(projection);
    svgMap
      .append("path")
      .attr("class", "sphere")
      .attr("d", pathGenerator({ type: "Sphere" }));
    const filterData = rawData.filter((d) => d.Year === year);
    console.log(filterData, "filterData");
    const colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([0, 100]);

    svgMap
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("stroke-width", "0.1px");

    d3.selectAll(".country")
      .attr("fill", (d, i) => {
        const item = filterData.find((item) => {
          return item.Entity === d.properties.name;
        });
        const count = (item || {})["Terrorism deaths"];
        if (count) {
          return colorScale(+count);
        } else {
          return "#fff";
        }
      })
      .on("mouseover", function (event, d) {
        const item = filterData.find((item) => {
          return item.Entity === d.properties.name;
        });
        const count = (item || {})["Terrorism deaths"];
        d3.select(this).attr("opacity", 1).attr("stroke-width", 2);
        tooltip
          .style("opacity", 1)
          .html(
            `
              <p>Country: ${d.properties.name}</p>
              <p>Year: ${year}</p>
              <p>Terrorism deaths: ${count || "No Data"}</p>
              `
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 5}px`);

        renderLine(rawData, d.properties.name, gdpData);
      })
      .on("mousemove", function (event, d) {
        const item = filterData.find((item) => {
          return item.Entity === d.properties.name;
        });
        const count = (item || {})["Terrorism deaths"];
        d3.select(this).attr("opacity", 1).attr("stroke-width", 2);
        tooltip
          .style("opacity", 1)
          .html(
            `
              <p>Country: ${d.properties.name}</p>
              <p>Year: ${year}</p>
              <p>Terrorism deaths: ${count || "No Data"}</p>
              `
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 5}px`);
      })
      .on("mouseout", function (event, d) {
        d3.selectAll(".country").attr("opacity", 1).attr("stroke-width", 0.1);
        tooltip.style("opacity", 0);
      });
  };

  const renderLine = (rawData, country, gdp) => {
    const marginTop = 120;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 80;

    const dataList = rawData.filter((d) => d.Entity === country);
    if (dataList.length === 0) {
      return;
    }

    const svgLine = d3.select("#line");
    svgLine.selectAll("*").remove();

    svgLine.attr("width", width).attr("height", height);
    const targetGdp = gdp.find((item) => item["Country Name"] === country);
    console.log(targetGdp, dataList);

    const data1 = dataList.map((d) => {
      const year = d.Year;
      return {
        ...d,
        gdp: (targetGdp || {})[year] || "0",
      };
    });
    console.log(data1);

    const data = [];
    data1.forEach((element) => {
      Object.keys(element).forEach((key) => {
        if (key !== "Year" && key !== "Code" && key !== "Entity") {
          data.push({
            type: key,
            Year: element["Year"],
            value: element[key] || 0,
          });
        }
      });
    });
    console.log(data);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => +d.Year))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => +d["value"]))
      .range([height - marginBottom, marginTop])
      .nice();

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.type))
      .range(d3.schemeCategory10);

    const legend = svgLine
      .append("g")
      .attr("transform", "translate(0, 120)")
      .attr("font-size", 14)
      .selectAll("g")
      .data(Array.from(new Set(d3.map(data, (d) => d.type))))
      .join("g")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 25 + ")";
      });

    legend
      .append("circle")
      .attr("r", 10)
      .attr("cx", 100)
      .attr("cy", 10)
      .attr("fill", function (d) {
        return color(d);
      });

    legend
      .append("text")
      .attr("x", 120)
      .attr("y", 15.5)
      .text(function (d) {
        return d === "gdp" ? "GDP per capita" : d;
      });

    svgLine
      .append("text")
      .text("Terrorism deaths VS GDP per capita (Current US$)")
      .attr("transform", `translate(${width / 2}, ${marginTop / 2})`)
      .style("text-anchor", "middle")
      .attr("fill", "#635F5D")
      .attr("font-size", "1.2em");

    svgLine
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    svgLine
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));

    const serie = svgLine
      .append("g")
      .selectAll()
      .data(
        d3.group(data, (d) => {
          return d.type;
        })
      )
      .join("g");

    serie
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => {
        return color(d[0]);
      })
      .attr("stroke-width", 1.5)
      .attr("d", (d) => {
        return d3
          .line()
          .curve(d3.curveLinear)
          .defined(function (d) {
            return d.value !== 0;
          })
          .x((d) => {
            return x(d.Year) || 0;
          })
          .y((d) => y(+d["value"]))(d[1].sort((a, b) => a.Year - b.Year));
      });
  };

  const renderBar = (data, year) => {
    const svgBar = d3.select("#bar");

    svgBar.selectAll("*").remove();

    svgBar.attr("width", width).attr("height", height);

    const filterData = data
      .filter((item) => item.Year === year)
      .sort((a, b) => b["Terrorism deaths"] - a["Terrorism deaths"])
      .slice(0, 10);

    console.log(filterData);
    var color = d3.scaleSequential(d3.interpolateOranges).domain([0, 5]);

    const margin = { t: 30, r: 20, b: 70, l: 60 };
    const innerWidth = width - margin.l - margin.r;
    const innerHeight = height - margin.t - margin.b;
    svgBar.selectAll("*").remove();
    svgBar
      .append("text")
      .text("Total Terrorism deaths by Region")
      .attr("transform", `translate(${innerWidth / 1.5}, ${margin.t / 2})`)
      .style("text-anchor", "middle")
      .attr("fill", "#635F5D")
      .attr("font-size", "1.2em");

    const g = svgBar
      .append("g")
      .attr("transform", `translate(${margin.l}, ${margin.t})`);

    const xScale = d3
      .scaleBand()
      .domain(filterData.map((d) => d.Entity))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filterData, (item) => +item["Terrorism deaths"])])
      .range([innerHeight, 0])
      .nice();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`)
      .selectAll("text")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "end")
      .attr("dy", ".5em")
      .attr("dx", ".8em");
    g.append("g").call(yAxis);

    g.selectAll(".rect")
      .data(filterData)
      .join("rect")
      .attr("class", "rect")
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d["Terrorism deaths"]))
      .attr("fill", (d, i) => color(d["Terrorism deaths"]))
      .attr("x", (d) => xScale(d.Entity))
      .attr("y", (d) => yScale(d["Terrorism deaths"]));

    g.selectAll(".rect")
      .on("mouseover", function (event, d) {
        console.log(d, event);
        d3.selectAll(".rect").style("opacity", 0.7);
        d3.select(this).style("opacity", 1);
        tooltip
          .style("opacity", 1)
          .html(
            `
            <p>Company: ${d.Entity}</p>
            <p>Rating: ${d["Terrorism deaths"]}</p>
          `
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 5}px`);
      })
      .on("mousemove", (event) => {
        // 移动提示
        tooltip
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 5}px`);
      })
      .on("mouseout", function () {
        d3.selectAll(".rect").style("opacity", 1);
        tooltip.style("opacity", 0);
      });
  };

  useEffect(() => {
    Promise.all([
      d3.json("./data/world.json"),
      d3.tsv("./data/50m.tsv"),
      d3.csv("./data/terrorism-deaths.csv"),
      d3.csv("./data/gdp.csv"),
    ]).then((res) => {
      const [topoJSONdata, tsvData, rawData, gdpData] = res || [];
      setGdpData(gdpData);
      const rowById = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d;
        return accumulator;
      }, {});

      const countries = topojson.feature(
        topoJSONdata,
        topoJSONdata.objects.countries
      );

      countries.features.forEach((d) => {
        Object.assign(d.properties, rowById[d.id]);
      });
      console.log(countries.features, "countries.features");
      renderMap(countries.features, rawData, "1970", gdpData);
      renderBar(rawData, "1970");
      renderLine(rawData, "China", gdpData);
      setRawData(rawData);
      setCountries(countries.features);
    });
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    setYear(e.target.value);
    renderMap(countries, rawData, e.target.value, gdpData);
    renderBar(rawData, e.target.value);
  };

  return (
    <div className="container11">
      <div className="map">
        <h1>World Terrorism deaths</h1>
        <div className="slider">
          <span>Year</span>
          <input
            type="range"
            id="slider"
            min="1970"
            max="2021"
            value={year}
            onChange={handleChange}
          />
          <span id="percentText">{year}</span>
        </div>
        <svg id="map" width="960" height="500"></svg>
      </div>
      <div>
        <div>
          <svg id="bar"></svg>
        </div>
        <div>
          <svg id="line"></svg>
        </div>
      </div>
    </div>
  );
}
export default App;
