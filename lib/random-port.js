var net = require('net');

/* return a free odd port number for android emulator */
var random_port = function(cb) {
    var from = 5554,
        to = 5680,
        range = (to - from) / 2,
        port = from + ~~(Math.random() * range) * 2;

    var server = net.createServer();
    server.listen(port, function (err) {
        server.once('close', function () {
            cb(port);
        });
        server.close();
    });
    server.on('error', function (err) {
        random_port(opts, cb);
    });
};

module.exports = random_port;
