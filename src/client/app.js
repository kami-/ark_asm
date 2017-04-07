const m = require("mithril");
const Graph = require("./Graph");
const Store = require("./Store");
const Config = require("./Config");
const Server = require("./component/Server");

const webSocket = new WebSocket('ws://localhost:8084');

webSocket.addEventListener('message', function (event) {
    const message = JSON.parse(event.data);
    if (message.type === "mission-init") {
        processMissionInit(message.serverId);
    }
    else if (message.type === "mission-snapshot") {
        processSnapshot(message.snapshot);
    }
});

function processMissionInit(serverId) {
    var server = Store.getOrCreateServer(serverId);
    server.tickTime = 0;
    Config.seriesAxes.forEach(prop => {
        server.data[prop].splice(0, server.data[prop].length);
    });
}

function processSnapshot(rawSnapshot) {
    var server = Store.getOrCreateServer(rawSnapshot.serverId);
    server.missionName = rawSnapshot.missionName;
    server.tickTime = rawSnapshot.tickTime;
    pushData(server, rawSnapshot);
    m.mount(document.body, Server.Servers);
    Graph.updateGraph(server.graph, server.tickTime);
}

function pushData(server, rawSnapshot) {
    const toPointWithTickTime = toPoint.bind(null, server.tickTime);
    const canShift = Graph.canShift(server.tickTime);
    Config.seriesAxes.forEach(prop => {
        const data = server.data[prop];
        data.push(toPointWithTickTime(rawSnapshot[prop]));
        if (canShift) { data.shift(); }
    });
}

function toPoint(tickTime, y) {
    return { x: tickTime, y: y };
}

/*
var tm = 0;
var int1 = setInterval(() => {
    var rawSnapshot = {
        tickTime: tm,
        serverId: "123",
        missionName: "ark44_co98_the_great_crusade.Colleville"
    };
    Config.seriesAxes.forEach(prop => {
        rawSnapshot[prop] = Math.random() * Config.series[prop].maxValue;
    });
    tm = tm + 5;
    processSnapshot(rawSnapshot);
}, 200);


var tm2 = 0;
var int2 = setInterval(() => {
    var rawSnapshot = {
        tickTime: tm2,
        serverId: "1234",
        missionName: "ark_co68_30_minutes_loadout.ThirskW"
    };
    Config.seriesAxes.forEach(prop => {
        rawSnapshot[prop] = Math.random() * Config.series[prop].maxValue;
    });
    tm2 = tm2 + 5;
    processSnapshot(rawSnapshot);
}, 1000);

setTimeout(() => {
    processMissionInit("123");
    clearInterval(int1);
}, 5000);

setTimeout(() => {
    var tm3 = 0;
setInterval(() => {
    var rawSnapshot = {
        tickTime: tm3,
        serverId: "123",
        missionName: "ark44_co98_the_great_crusade.Colleville"
    };
    Config.seriesAxes.forEach(prop => {
        rawSnapshot[prop] = Math.random() * Config.series[prop].maxValue;
    });
    tm3 = tm3 + 5;
    processSnapshot(rawSnapshot);
}, 200)
}, 10000);
*/