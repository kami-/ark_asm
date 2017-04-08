const d3 = require("d3");
const Config = require("./Config");

function createGraph(container, server, width, height) {
    const xScale = d3.scale.linear()
        .domain([0, Config.graph.xLengthInSeconds])
        .range([0, width]);

    const svg = d3.select(container).append("svg")
        .attr("class", "graph")
        .attr("width", width)
        .attr("height", height + Config.graph.margin.top + Config.graph.margin.bottom);
    svg.append("rect")
        .attr("class", "bg")
        .attr("width", "100%")
        .attr("height", "100%");

    const xAxis = d3.svg.axis()
        .ticks(18)
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickFormat(formatTime)
        .scale(xScale)
        .orient("bottom");

    const xAxisView = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    const pathsContainer = svg.append("g");
    const series = Config.seriesAxes.reduce((acc, prop) => {
        const yScale = d3.scale.linear()
            .domain([0, Config.series[prop].maxValue])
            .range([height, 0]);
        const yLine = d3.svg.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            //.interpolate("step-before");
            .interpolate("linear");
        const path = pathsContainer.append("path")
            .data([server.data[prop]])
            .attr("class", "line " + prop)
            .style("stroke", Config.series[prop].color);
        acc[prop] = {
            yScale: yScale,
            yLine: yLine,
            path: path
        };
        return acc;
    }, {});

    return {
        svg: svg,
        xScale: xScale,
        xAxis: xAxis,
        xAxisView: xAxisView,
        series: series
    };
}

function updateGraph(graph, time) {
    Config.seriesAxes.forEach(prop => {
        const series = graph.series[prop];
        series.path.attr("d", series.yLine);
    });


    if (canShift(time)) {
        graph.xScale.domain([time - Config.graph.xLengthInSeconds, time]);
    }

    graph.xAxisView.transition()
        .duration(1)
        .ease("linear")
        .call(graph.xAxis);
}

function canShift(time) {
    return time >= Config.graph.xLengthInSeconds;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    const minutesPrefix = minutes < 10 ? "0" : "";
    const hoursPrefix = hours < 10 ? "0" : "";
    return hoursPrefix + hours + ":" + minutesPrefix + minutes;
}

module.exports = {
    createGraph: createGraph,
    updateGraph: updateGraph,
    canShift: canShift
}