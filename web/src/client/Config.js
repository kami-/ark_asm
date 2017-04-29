const series = {
        fps: {
            label: "FPS",
            maxValue: 65,
            color: "#F78900"
        },
        fpsMin: {
            label: "FPS Min",
            maxValue: 65,
            color: "#800000"
        },
        cps: {
            label: "CPS",
            maxValue: 65,
            color: "#E5E500"
        },
        playerCount: {
            label: "Players",
            maxValue: 400,
            color: "#3EB2F2"
        },
        localAiCount: {
            label: "Local AI",
            maxValue: 1000,
            color: "#8ECFFF"
        },
        remoteAiCount: {
            label: "Remote AI",
            maxValue: 1000,
            color: "#C9E3FF"
        },
        entityCount: {
            label: "Entities",
            maxValue: 1000,
            color: "#03CC20"
        }
    };
const seriesAxes = Object.getOwnPropertyNames(series);

module.exports = {
    seriesAxes: seriesAxes,
    series: series,
    graph: {
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        xLengthInSeconds: 20 * 60,
        width: 750,
        height: 260
    }
}