ark_asm_fnc_startMonitoring = {
    ["ark_asm_monitor", "onEachFrame", {
        ark_asm_conditionEvaluationCount = ark_asm_conditionEvaluationCount + 1;
    }] call BIS_fnc_addStackedEventHandler;
    
    [] spawn {
        while {true} do {
            [] call ark_asm_fnc_monitor;
            sleep ark_adm_monitorDelay;
        };
    };
};

ark_asm_fnc_monitor = {
    private _playerCount = count (allUnits select { alive _x && {isPlayer _x} });
    private _localAiCount = count (allUnits select { alive _x && {!isPlayer _x} && {local _x} });
    private _remoteAiCount = count (allUnits select { alive _x && {!isPlayer _x} && {!local _x} });
    private _entityCount = count (entities [[], [], true, false]);
    "ark_asm_extension" callExtension ["mission.snapshot", [
        "missionName", missionName,
        "tickTime", diag_tickTime,
        "fps", diag_fps,
        "fpsMin", diag_fpsMin,
        "frameNumber", diag_frameNo,
        "conditionEvaluationCount", ark_asm_conditionEvaluationCount,
        "playerCount", _playerCount,
        "localAiCount", _localAiCount,
        "remoteAiCount", _remoteAiCount,
        "entityCount", _entityCount
    ]];
};

[] call ark_asm_fnc_startMonitoring;