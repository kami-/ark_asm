const d3 = require("d3");

const seriesConfig = {
    fps: {
        label: "FPS",
        maxValue: 70
    },
    fpsMin: {
        label: "FPS Min",
        maxValue: 70
    },
    cps: {
        label: "CPS",
        maxValue: 70
    },
    playerCount: {
        label: "Players",
        maxValue: 400
    },
    localAiCount: {
        label: "Local AI",
        maxValue: 1000
    },
    remoteAiCount: {
        label: "Remote AI",
        maxValue: 1000
    },
    entityCount: {
        label: "Entities",
        maxValue: 1000
    }
};
const seriesAxes = Object.getOwnPropertyNames(seriesConfig);

const shownSeconds = 300;
const missions = {};
const webSocket = new WebSocket('ws://localhost:8084');

webSocket.addEventListener('message', function (event) {
    var rawMission = JSON.parse(event.data);
    console.log('Message from server', rawMission);
    processMission(rawMission);
});

function processMission(rawMission) {
    var mission = missions[rawMission.missionId];
    if (!mission) {
        mission = createMission(rawMission);
        missions[rawMission.missionId] = mission;
        createGraph(mission);
        console.log("graph created", mission.graph);
    }
    console.log(mission);
    pushSeriesData(mission, rawMission);
    updateGraph(mission);
}

function createMission(rawMission) {
    return {
        missionId: rawMission.missionId,
        seriesData: seriesAxes.reduce((acc, prop) => {
            acc[prop] = [];
            return acc;
        }, {})
    };
}

function pushSeriesData(mission, rawMission) {
    const toPointWithTickTime = toPoint.bind(null, rawMission.tickTime);
    seriesAxes.forEach(prop => {
        mission.seriesData[prop].push(toPointWithTickTime(rawMission[prop]));
    });
}

function toPoint(tickTime, y) {
    return { x: tickTime, y: y };
}

var tm = 0;
setInterval(() => {
    var rawMission = {
        tickTime: tm,
        missionId: "123"
    };
    seriesAxes.forEach(prop => {
        rawMission[prop] = Math.random() * seriesConfig[prop].maxValue;
    });
    tm = tm + 5;
    console.log(tm, "generated rawMission", rawMission);
    processMission(rawMission);
}, 5000);

function createGraph(mission) {
    const width = 900,
        height = 500;

    const x = d3.scale.linear()
        .domain([0, shownSeconds])
        .range([0, width]);

    const y = d3.scale.linear()
        .domain([0, 1000])
        .range([height, 0]);

    const line = d3.svg.line()
        //.interpolate('basis')
        .x(d => x(d.x))
        .y(d => y(d.y));

    const svg = d3.select("#missions > .graph").append("svg")
        .attr("class", "chart")
        .attr("width", width)
        .attr("height", height + 50)

    const xAxis = d3.svg.axis()
        .tickFormat(d => "" + Math.floor(d/60) + "m")
        .scale(x)
        .orient("bottom");

    const axis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    const paths = svg.append("g")

    mission.seriesPaths = {};
    seriesAxes.forEach(prop => {
        const path = paths.append("path")
            .data([mission.seriesData[prop]])
            .attr("class", prop + " group")
            .style("stroke", "black");
        mission.seriesPaths[prop] = path;
    });

    mission.graph = {
        x: x,
        y: y,
        line: line,
        axis: axis,
        xAxis: xAxis,
        paths: paths
    };
}

function updateGraph(mission) {
    seriesAxes.forEach(prop => {
        mission.seriesPaths[prop]
            .attr("d", mission.graph.line);
    });

    if (tm >= shownSeconds) {
        mission.graph.x.domain([tm - shownSeconds, tm]);
    }

    mission.graph.axis.transition()
        .duration(1)
        .ease("linear")
        .call(mission.graph.xAxis);
}
