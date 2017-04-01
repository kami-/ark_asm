class CfgPatches {
    class ark_asm {
        units[] = {};
        weapons[] = {};
        requiredVersion = 1.67;
        requiredAddons[] = {"CBA_MAIN"};
        author = "Kami";
        authorUrl = "https://github.com/kami-/ark_asm";
    };
};

class Extended_PreInit_EventHandlers {
    class ark_asm {
        init = "[] call compile preProcessFileLineNumbers 'x\ark\addons\ark_asm\preinit.sqf';";
    };
};

class Extended_PostInit_EventHandlers {
    class ark_asm {
        init = "[] call compile preProcessFileLineNumbers 'x\ark\addons\ark_asm\postinit.sqf';";
    };
};
