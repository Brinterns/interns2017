module.exports = {
    protocol: 'http',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8080,
    cloakPort: process.env.CLOAK_PORT || 8090,
    mongoAdd: process.env.MONGO_ADD || '@ds113713.mlab.com:13713/jurr-test',
    mongoUsr: process.env.MONGO_USR || 'local-dev',
    mongoPsswd: process.env.MONGO_PSSWD || 'sdfsakjfhsa98d6asd9f088768sdfasjdf'
};
