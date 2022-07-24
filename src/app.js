require('./config');
const express = require("express");
const app = express();
const startMongo = require("./mongoConnection")
const routes = require('./routes/index.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.listen(config.api.port, () => {
    console.log(`Server running on port ${config.api.port}`)
    startMongo()
})

app.use("/", routes)
