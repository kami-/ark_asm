const Rickshaw = require("Rickshaw");

const seriesAxes = ["fps", "fpsMin", "cps", "playerCount", "localAiCount", "remoteAiCount", "entityCount"];
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
        mission.graph = createGraph(mission);
        console.log("graph created", mission.graph);
    }
    console.log(mission);
    pushSeriesData(mission, rawMission);
    mission.graph.update();
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

function createGraph(mission) {
    const palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );
    return new Rickshaw.Graph( {
        element: document.getElementById("chart"),
        width: 900,
        height: 500,
        renderer: "line",
        stroke: true,
        preserve: true,
        series: seriesAxes.map(prop => {
            console.log(prop, mission.seriesData[prop]);
            return {
                color: palette.color(),
                data: mission.seriesData[prop],
                name: prop
            };
        })
    });
}
