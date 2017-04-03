(function() {
    const webSocket = new WebSocket('ws://localhost:8084');

    webSocket.addEventListener('message', function (event) {
        console.log('Message from server', JSON.parse(event.data));
    });
})();