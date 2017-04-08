const Server = require("./Server");

function parseSnapshot(rawSnapshot) {
    ["missionStartTime", "tickTime", "fps", "fpsMin", "frameNumber", "conditionEvaluationCount", "playerCount", "localAiCount", "remoteAiCount", "entityCount"].forEach(prop => {
        rawSnapshot[prop] = parseFloat(rawSnapshot[prop]);
    });
    return rawSnapshot;
}

module.exports = {
    parseSnapshot: parseSnapshot
};