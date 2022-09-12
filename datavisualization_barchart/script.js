async function Dataset() {
    const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

    const jsonData = await fetch(URL)
                    .then(res => res.json());

    return jsonData;
}

function updateToolTip(bar) {

}

async function init() {
    "use strict";

    // consts
    const jsonResponse = await Dataset();
    const xAxisName = jsonResponse['column_names'][0];
    const yAxisName = jsonResponse['column_names'][1];
    const data = jsonResponse['data'];
    const w = 1200;
    const h = 600;
    const axisPadding = 50;
    const chartPaddingLeft = axisPadding;
    const chartPaddingRight = 30;
    const chartPaddingTop = 30;
    const chartPaddingBottom= axisPadding;
    const barWidth = (w - chartPaddingLeft - chartPaddingRight) / data.length;

    // create SVG
    const svg = d3.select('body')
    .append('svg')
        .attr("width", w)
        .attr("height", h);

    svg.append('text')
        .attr("id", "title")
        .attr("y", 20)
        .attr("x", w / 2 - 75)
        .style("font-size", "1.5em")
        .text("GDP over the years");

    // create Scales
    const xScale = d3.scaleLinear()
                    .domain([d3.min(data, d => new Date(d[0])), d3.max(data, d => new Date(d[0]))])
                    .range([chartPaddingLeft, w - chartPaddingRight]);

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[1])])
                    .range([h - chartPaddingBottom, chartPaddingTop]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    const yAxis = d3.axisLeft(yScale);

    // add bars to the svg canvas
    svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
        .attr("transform", "translate(" + chartPaddingLeft + ", 0)")
        .attr("x", (d, i) => (barWidth * i))
        .attr("y", d => yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", d => (h - chartPaddingBottom - yScale(d[1])))
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("class", "bar")
        .append('title')
            .attr("id", "tooltip")
            .attr("data-date", d => d[0])
            .text(d => ("Date: " + d[0] + "\nGDP: " + d[1]));
    
    // add axes
    svg.append('g')
        .attr("transform", "translate(0," + (h - axisPadding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);
    svg.append('g')
        .attr("transform", "translate(" + axisPadding + ",0)")
        .attr("id", "y-axis")
        .call(yAxis);
}

window.onload = init;