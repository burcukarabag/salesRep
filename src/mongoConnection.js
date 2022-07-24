const connectionString = `mongodb://${config.db.username}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=admin`;
const mongoose = require("mongoose");

const startMongo = () => {
    mongoose.connect(connectionString,  {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
}

module.exports = startMongo;