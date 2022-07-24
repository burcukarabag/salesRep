//

const dotenv = require('dotenv');
const result = dotenv.config();
let envs;

if (result.error) {
    envs = process.env;
} else {
    envs = result.parsed
}

let config = {
    api: {
        port: envs.SERVER_PORT || 3000,
        url: envs.SERVER_URL || "http://127.0.0.1"
    },
    db: {
        host: envs.MONGO_HOST,
        port: envs.MONGO_PORT,
        username: envs.MONGO_USERNAME,
        password: envs.MONGO_PASSWORD,
        name: envs.MONGO_DB_NAME
    }
};

global['config'] = config;
module.exports = config;