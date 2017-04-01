const express = require("express");
const bodyParser = require("body-parser");

const app = express();
    //app.use(Settings.CONTEXT_PATH, express.static(Settings.PATH.CLIENT_RESOURCES_HOME));
app.use(bodyParser.json());

app.post("/mission-snapshot", (request, response) => {
    console.log(request.headers);
    console.log("-------------------------------------------");
    console.log(request.body);
    console.log("+++++++++++++++++++++++++++++++++++++++++++");
    response.json({});
});

const server = app.listen(80, () => {
    console.log(`Listening on port ${server.address().port}.`);
});