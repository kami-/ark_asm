const missions = {};

function parseSnapshot(rawSnapshot) {
    ["tickTime", "fps", "fpsMin", "frameNumber", "conditionEvaluationCount", "playerCount", "localAiCount", "remoteAiCount", "entityCount"].forEach(prop => {
        rawSnapshot[prop] = parseFloat(rawSnapshot[prop]);
    });
    return rawSnapshot;
}

function createMission(snapshot) {
    var mission = {
        cps: 0,
        previousSnapshot: snapshot
    };
    updateMission(mission, snapshot);
    missions[snapshot.missionId] = mission;
    return mission;
}

function updateMission(mission, snapshot) {
    const previousSnapshot = mission.previousSnapshot;
    const elapsedTime = (snapshot.tickTime - previousSnapshot.tickTime);
    const cps = elapsedTime === 0
        ? 0
        : (snapshot.conditionEvaluationCount - previousSnapshot.conditionEvaluationCount) / elapsedTime;
    mission.processId = snapshot.processId;
    mission.missionId = snapshot.missionId;
    mission.missionName = snapshot.missionName;
    mission.tickTime = snapshot.tickTime;
    mission.fps = snapshot.fps;
    mission.fpsMin = snapshot.fpsMin;
    mission.cps = cps;
    mission.playerCount = snapshot.playerCount;
    mission.localAiCount = snapshot.localAiCount;
    mission.remoteAiCount = snapshot.remoteAiCount;
    mission.entityCount = snapshot.entityCount;
    mission.previousSnapshot = snapshot;
}

function processSnapshot(snapshot) {
    parseSnapshot(snapshot);
    var mission = missions[snapshot.missionId];
    if (mission) {
        updateMission(mission, snapshot);
    } else {
        mission = createMission(snapshot);
    }
    return mission;
}

module.exports = {
    processSnapshot: processSnapshot
};