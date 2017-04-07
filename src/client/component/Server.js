const m = require("mithril");
const Config = require("../Config");
const Graph = require("../Graph");
const Store = require("../Store");

const Servers = {
    view: () => {
        const servers = Store.getServers().map(serverView);
        return m("div#servers", servers);
    }
}

function serverView(server) {
    const fields =  Config.seriesAxes.map(prop => {
        const seriesConfig = Config.series[prop];
        const data = server.data[prop];
        const lastValue = data.length > 0 ? data[data.length - 1].y : 0;
        return fieldView(seriesConfig.label, lastValue, seriesConfig.color);
    });

    return m("div.server", [
        m("div.summary", [
            m("div.details", detailsView(server.missionName)),
            m("div.series", fields)
        ]),
        m("div.graph-container", {
            oncreate: function(vnode) {
                server.graph = Graph.createGraph(vnode.dom, server, Config.graph.width, Config.graph.height);
            }
        })
    ]);
}

function detailsView(missionName) {
    return m("span", missionName);
}

function fieldView(label, value, color) {
    return m("div.field", { style: `color: ${color}` }, [
        m("label", label + ":"),
        m("span.value", Math.floor(value))
    ]);
}

function appendDOM(dom) {

}

module.exports = {
    Servers: Servers
}