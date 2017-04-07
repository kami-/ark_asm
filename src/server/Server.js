const servers = {};

function getOrCreateServer(snapshot) {
    var server = servers[snapshot.serverId];
    if (!server) {
        server = {
            cps: 0,
            previousSnapshot: snapshot
        };
        servers[snapshot.serverId] = server;
        updateServer(server, snapshot);
    }
    return server;
}

function updateServer(server, snapshot) {
    const previousSnapshot = server.previousSnapshot;
    const elapsedTime = (snapshot.tickTime - previousSnapshot.tickTime);
    const cps = elapsedTime === 0
        ? 0
        : (snapshot.conditionEvaluationCount - previousSnapshot.conditionEvaluationCount) / elapsedTime;
    server.processId = snapshot.processId;
    server.serverId = snapshot.serverId;
    server.missionName = snapshot.missionName;
    server.tickTime = snapshot.tickTime;
    server.fps = snapshot.fps;
    server.fpsMin = snapshot.fpsMin;
    server.cps = cps;
    server.playerCount = snapshot.playerCount;
    server.localAiCount = snapshot.localAiCount;
    server.remoteAiCount = snapshot.remoteAiCount;
    server.entityCount = snapshot.entityCount;
    server.previousSnapshot = snapshot;
}

function removeServer(serverId) {
    delete servers[serverId];
}

module.exports = {
    getOrCreateServer: getOrCreateServer,
    updateServer: updateServer,
    removeServer: removeServer
};