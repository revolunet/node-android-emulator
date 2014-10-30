 var fs = require('fs'),
     path = require('path'),
     shell = require('shelljs'),
     Q = require('q'),
     random_port = require('./random-port');


module.exports = {
     list: function() {
         var defer = Q.defer(),
             cmd = 'android list avd -c';

         shell.exec(cmd, {
             silent: true
         }, function(code, output) {
             if (code === 0) {
                 console.info('emulator.create: success');
                 defer.resolve(output.trim().split('\n'));
             } else {
                 console.error('emulator.create: error occured running', cmd);
                 defer.reject(output);
             }
         });

         return defer.promise;
     },
     create: function(name, options) {
         var defer = Q.defer(),
             cmd = 'echo no | android create avd --force --name ' + name;

         // naive CLI command build
         for (var option in options) {
             cmd += ' --' + option + ' ' + options[option];
         }

         console.info('emulator.create:', cmd);

         shell.exec(cmd, {
             silent: true
         }, function(code, output) {
             if (code === 0 && !/Error:/.test(output) && (/Do you wish to create a custom hardware profile/.test(output) || /Created AVD/.test(output))) {
                 console.info('emulator.create: success');
                 defer.resolve();
             } else {
                 console.error('emulator.create: error occured running', cmd);
                 defer.reject(output);
             }
         });

         return defer.promise;
     },
     start: function(name) {
         // start given emulator with a random port and wait for boot to complete
         var defer = Q.defer();

         function checkBooted(port) {
             if (defer.promise.isRejected()) {
                 return;
             }
             console.info('emulator.start: poll port', port);
             var checkCmd = 'adb -s emulator-' + port + ' shell getprop sys.boot_completed';
             shell.exec(checkCmd, {
                 silent: true
             }, function(code, output) {
                 if (code !== 0) {
                     setTimeout(checkBooted.bind(this, port), 500);
                 } else {
                     defer.resolve({
                         port: port
                     });
                 }
             });
         }

         // find a random port then start emulator
         random_port(function(port) {
             var cmd = 'emulator -avd ' + name + ' -port ' + port;
             console.info('emulator.start:', cmd);

             shell.exec(cmd, {
                 async: true
             }, function(code, output) {
                 if (code !== 0) {
                     defer.reject(output);
                 }
             });
             // start polling for device ready
             checkBooted(port);
         });

         return defer.promise;

     },

     stop: function(port) {

         var defer = Q.defer();

         var cmd = 'adb -s emulator-' + port + ' emu kill';

         shell.exec(cmd, {
             silent: true
         }, function(code, output) {
             if (code === 0 && !/error/.test(output)) {
                 console.info('emulator.stop: success');
                 defer.resolve();
             } else {
                 console.error('emulator.stop: error', output);
                 defer.reject(output);
             }
         });

         return defer.promise;

     }

 };
