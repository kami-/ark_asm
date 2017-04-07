const m = require("mithril");
const Graph = require("./Graph");
const Store = require("./Store");
const Config = require("./Config");
const Server = require("./component/Server");

const webSocket = new WebSocket('ws://localhost:8084');

webSocket.addEventListener('message', function (event) {
    var rawSnapshot = JSON.parse(event.data);
    processSnapshot(rawSnapshot);
});

function processSnapshot(rawSnapshot) {
    var server = Store.getOrCreateServer(rawSnapshot);
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

var tm = 0;
setInterval(() => {
    var rawSnapshot = {
        tickTime: tm,
        serverId: "123"
    };
    Config.seriesAxes.forEach(prop => {
        rawSnapshot[prop] = Math.random() * Config.series[prop].maxValue;
    });
    tm = tm + 5;
    processSnapshot(rawSnapshot);
}, 200);


var tm2 = 0;
setInterval(() => {
    var rawSnapshot = {
        tickTime: tm2,
        serverId: "1234"
    };
    Config.seriesAxes.forEach(prop => {
        rawSnapshot[prop] = Math.random() * Config.series[prop].maxValue;
    });
    tm2 = tm2 + 5;
    processSnapshot(rawSnapshot);
}, 1000);