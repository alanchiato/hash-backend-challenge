const pino = require('pino')({
    prettyPrint: {
        levelFirst: true,
        colorize: true,
        singleLine: true,
    },
})

module.exports = pino;