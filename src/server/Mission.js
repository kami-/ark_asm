const missions = {};

function parseSnapshot(rawSnapshot) {
    ["tickTime", "fps", "fpsMin", "frameNumber", "conditionEvaluationCount", "playerCount", "localAiCount", "remoteAiCount", "entityCount"].forEach(prop => {
        rawSnapshot[prop] = parseFloat(rawSnapshot[prop]);
    });
    return rawSnapshot;
}

function createMission(snapshot) {
    const mission = {
        missionId: snapshot.missionId,
        previousSnapshot: snapshot
    };
    missions[snapshot.missionId] = mission;
    return mission;
}

function updateMission(mission, snapshot) {
    const previousSnapshot = mission.previousSnapshot;
    const cps = (snapshot.conditionEvaluationCount - previousSnapshot.conditionEvaluationCount) / (snapshot.tickTime - previousSnapshot.tickTime);
    return {
        processId: snapshot.processId,
        missionId: snapshot.missionId,
        missionName: snapshot.missionName,
        tickTime: snapshot.tickTime,
        fps: snapshot.fps,
        fpsMin: snapshot.fpsMin,
        cps: cps,
        playerCount: snapshot.playerCount,
        localAiCount: snapshot.localAiCount,
        remoteAiCount: snapshot.remoteAiCount,
        entityCount: snapshot.entityCount,
        previousSnapshot: snapshot
    };
}

function processSnapshot(snapshot) {
    var mission = missions[snapshot.missionId];
    if (mission) {
        mission = updateMission(mission, snapshot);
    } else {
        mission = createMission(snapshot);
    }
    missions[snapshot.missionId] = mission;
    return mission;
}

module.exports = {
    processSnapshot: processSnapshot
};