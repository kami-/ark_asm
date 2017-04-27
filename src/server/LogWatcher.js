const fs = require("fs");
const Tail = require("tail").Tail;

const Config = require("./Config");
const WebSocket = require("./WebSocket");

let watchableFiles = new Set();
let watchedFiles = {};

function createWatch(file) {
    const watch = {
        tail: new Tail(file),
        clients: new WeakSet()
    };
    watch.tail.unwatch();
    watch.tail.on("line", line => {
        WebSocket.broadcastLogToClients(watch.clients, file, line);
    });
    return watch;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function updateWatchableFiles() {
    const files = Config.log.directories
        .map(dir =>
            fs.readdirSync(dir)
                .filter(file => endsWith(file, Config.log.extension))
        );
    return [].concat.apply([], files);
}

function init() {
    watchableFiles = updateWatchableFiles();
    setInterval(updateWatchableFiles, Config.log.pollingInterval);
}

function getWatchableFiles() {
    return watchableFiles.entries();
}

function watchLog(client, file) {
    if (watchableFiles.indexOf(file) === -1) { return }
    let watch = watchedFiles[file];
    if (!watch) {
        watch = createWatch(file);
        watchedFiles[file] = watch;
        watch.watch();
    }
    watch.clients.add(client);
}

function unwatchLog(client, file) {
    let watch = watchedFiles[file];
    if (watch) {
        watch.clients.delete(client);
    }
}

module.exports = {
    init: init,
    getWatchableFiles: getWatchableFiles,
    watchLog: watchLog,
    unwatchLog: unwatchLog
};