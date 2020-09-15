ark_asm_fnc_postInit = {
    ark_asm_enabled = missionNamespace getVariable ["ark_asm_enabled", isServer || !hasInterface];
    if (ark_asm_enabled) then {
        ark_asm_missionStartTime = diag_tickTime;
        ark_asm_conditionEvaluationCount = 0;
        ark_asm_previousTickTime = 0;
        ark_asm_previousConditionEvaluationCount = 0;
        ark_adm_monitorDelay = missionNamespace getVariable ["ark_adm_monitorDelay", 5];
        "ark_asm_extension" callExtension ["mission.init", []];
        [] call ark_asm_fnc_startMonitoring;
        diag_log "[ark_asm]    ARK_ASM enabled, stating monitoring.";
    };
};

ark_asm_fnc_startMonitoring = {
    ["ark_asm_monitor", "onEachFrame", {
        ark_asm_conditionEvaluationCount = ark_asm_conditionEvaluationCount + 1;
    }] call BIS_fnc_addStackedEventHandler;

    ark_asm_fnc_monitor_handleId = [ark_asm_fnc_monitor, ark_adm_monitorDelay] call CBA_fnc_addPerFrameHandler;
};

ark_asm_fnc_monitor = {
    private _playerCount = count (allUnits select { alive _x && {isPlayer _x} });
    private _totalAiCount = count (allUnits select { alive _x && {!isPlayer _x} });
    private _activeAiCount = count (allUnits select { alive _x && {simulationEnabled _x} && {!isPlayer _x} });
    private _entityCount = count (entities [[], [], true, false]);
    private _snapsot = [
        "profileName", profileName,
        "isServer", isServer,
        "missionName", missionName,
        "worldName", worldName,
        "missionStartTime", ark_asm_missionStartTime,
        "tickTime", diag_tickTime,
        "fps", diag_fps,
        "fpsMin", diag_fpsMin,
        "cps", [] call ark_asm_fnc_getCurrentCps,
        "playerCount", _playerCount,
        "totalAiCount", _totalAiCount,
        "activeAiCount", _activeAiCount,
        "entityCount", _entityCount
    ];
    "ark_asm_extension" callExtension ["mission.snapshot", _snapsot];
    //diag_log format ["[ark_asm]    Snapshot sent to server '%1'.", _snapsot];
    ark_asm_previousConditionEvaluationCount = ark_asm_conditionEvaluationCount;
    ark_asm_previousTickTime = diag_tickTime;
};

ark_asm_fnc_getCurrentCps = {
    private _elapsedTime = diag_tickTime - ark_asm_previousTickTime;

    if (_elapsedTime > 0) then {
        (ark_asm_conditionEvaluationCount - ark_asm_previousConditionEvaluationCount) / _elapsedTime;
    } else {
        0;
    };
};

[] call ark_asm_fnc_postInit;