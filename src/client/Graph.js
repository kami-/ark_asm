const d3 = require("d3");

const margin = { top: 20, right: 20, bottom: 20, left: 20 },
    xLengthInSeconds = 20 * 60;
    seriesConfig = {
    fps: {
        label: "FPS",
        maxValue: 65,
        color: "#F78900"
    },
    fpsMin: {
        label: "FPS Min",
        maxValue: 65,
        color: "#800000"
    },
    cps: {
        label: "CPS",
        maxValue: 65,
        color: "#F8A100"
    },
    playerCount: {
        label: "Players",
        maxValue: 400,
        color: "#3EB2F2"
    },
    localAiCount: {
        label: "Local AI",
        maxValue: 1000,
        color: "#8ECFFF"
    },
    remoteAiCount: {
        label: "Remote AI",
        maxValue: 1000,
        color: "#C9E3FF"
    },
    entityCount: {
        label: "Entities",
        maxValue: 1000,
        color: "#03CC20"
    }
};
const seriesAxes = Object.getOwnPropertyNames(seriesConfig);

function createGraph(graphSelector, mission, width, height) {
    const xScale = d3.scale.linear()
        .domain([0, xLengthInSeconds])
        .range([0, width]);

    const series = seriesAxes.reduce((acc, prop) => {
        const yScale = d3.scale.linear()
            .domain([0, seriesConfig[prop].maxValue])
            .range([height, 0]);
        acc[prop] = {

        };
        return acc;
    }, {});
finish this script error
    seriesAxes.forEach(prop => {

        series[prop].yScale = yScale;
        const yLine = d3.svg.line()
            .x(d => xScale(d.x))
            .y(d => yScales[prop](d.y))
            .interpolate("step-before");
        yLines[prop] = yLine;
    });
    const yScales = {};
    seriesAxes.forEach(prop => {
        const yScale = d3.scale.linear()
            .domain([0, seriesConfig[prop].maxValue])
            .range([height, 0]);
        yScales[prop] = yScale;
    });

    const yLines = {};
    seriesAxes.forEach(prop => {
        const yLine = d3.svg.line()
            .x(d => xScale(d.x))
            .y(d => yScales[prop](d.y))
            .interpolate("step-before");
        yLines[prop] = yLine;
    });

    const line = d3.svg.line()
        .x(d => xScale(d.x))
        .y(d => y(d.y));

    const svg = d3.select(graphSelector).append("svg")
        .attr("class", "graph")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom);
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

    const pathsContainer = svg.append("g")
    const paths = {};
    seriesAxes.forEach(prop => {
        const path = pathsContainer.append("path")
            .data([mission.data[prop]])
            .attr("class", "line " + prop)
            .style("stroke", seriesConfig[prop].color);
        paths[prop] = path;
    });

    return {
        xScale: xScale,
        yLines: yLines,
        xAxis: xAxis,
        xAxisView: xAxisView,
        paths: paths
    };
}

function updateGraph(graph, time) {
    seriesAxes.forEach(prop => {
        graph.paths[prop].attr("d", graph.yLines[prop]);
    });


    if (time >= xLengthInSeconds) {
        graph.xScale.domain([time - xLengthInSeconds, time]);
    }

    graph.xAxisView.transition()
        .duration(1)
        .ease("linear")
        .call(graph.xAxis);
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
    seriesAxes: seriesAxes
}