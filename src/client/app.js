const Graph = require("./Graph");

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
        mission.graph = Graph.createGraph("#missions > .mission > .graph", mission, 900, 500);
        console.log("graph created", mission.graph);
    }
    console.log(mission);
    pushData(mission, rawMission);
    mission.tickTime = rawMission.tickTime;
    Graph.updateGraph(mission.graph, mission.tickTime);
}

function createMission(rawMission) {
    return {
        missionId: rawMission.missionId,
        data: Graph.seriesAxes.reduce((acc, prop) => {
            acc[prop] = [];
            return acc;
        }, {})
    };
}

function pushData(mission, rawMission) {
    const toPointWithTickTime = toPoint.bind(null, rawMission.tickTime);
    Graph.seriesAxes.forEach(prop => {
        mission.data[prop].push(toPointWithTickTime(rawMission[prop]));
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
    Graph.seriesAxes.forEach(prop => {
        rawMission[prop] = Math.random() * seriesConfig[prop].maxValue;
    });
    tm = tm + 5;
    console.log(tm, "generated rawMission", rawMission);
    processMission(rawMission);
}, 200);