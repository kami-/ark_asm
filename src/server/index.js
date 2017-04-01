const express = require("express");
const bodyParser = require("body-parser");

const missions = {};
const app = express();

app.use(bodyParser.json());

app.post("/mission-snapshot", (request, response) => {
    const snapshot = parseSnapshot(request.body);
    var mission = missions[snapshot.missionId];
    if (mission) {
        mission = processSnapshot(mission, snapshot);
    } else {
        mission = createMission(snapshot);
    }
    missions[snapshot.missionId] = mission;
    broadcastMission(mission);
    response.json({});
});

const server = app.listen(80, () => {
    console.log(`Listening on port ${server.address().port}.`);
});

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

function processSnapshot(mission, snapshot) {
    const previousSnapshot = mission.previousSnapshot;
    const cps = (snapshot.conditionEvaluationCount - previousSnapshot.conditionEvaluationCount) / (snapshot.tickTime - previousSnapshot.tickTime);
    return {
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

function broadcastMission(mission) {
    console.log(mission);
    console.log("+++++++++++++++++++++++++++++++");
}