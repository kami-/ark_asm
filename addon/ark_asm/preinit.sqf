ark_asm_fnc_preinit = {
    ark_asm_conditionEvaluationCount = 0;
    ark_adm_monitorDelay = 5;
    "ark_asm_extension" callExtension ["mission.init", []];
};

[] call ark_asm_fnc_preinit;