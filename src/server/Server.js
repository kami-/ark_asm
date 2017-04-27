const servers = {};

function sanitize(value) {
    return Math.max(value || 0, 0);
}

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
    const elapsedTime = snapshot.tickTime - previousSnapshot.tickTime;
    const cps = elapsedTime === 0
        ? 0
        : (snapshot.conditionEvaluationCount - previousSnapshot.conditionEvaluationCount) / elapsedTime;
    server.processId = snapshot.processId;
    server.serverId = snapshot.serverId;
    server.missionName = snapshot.missionName;
    server.worldName = snapshot.worldName;
    server.missionStartTime = snapshot.missionStartTime;
    server.tickTime = snapshot.tickTime;
    server.fps = sanitize(snapshot.fps);
    server.fpsMin = sanitize(snapshot.fpsMin);
    server.cps = sanitize(cps);
    server.playerCount = sanitize(snapshot.playerCount);
    server.localAiCount = sanitize(snapshot.localAiCount);
    server.remoteAiCount = sanitize(snapshot.remoteAiCount);
    server.entityCount = sanitize(snapshot.entityCount);
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