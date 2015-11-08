#!/usr/bin/env node
/**
 * GDB Debugger plugin for Cloud9 edited for gdb-arm plugin
 *
 * @author Ryan McGill <ryanjamesmcgill AT gmail DOT com>
 */
 
"use strict";
var SSH = require('simple-ssh');
var client = require('scp2');
var requirejs = require('requirejs');
var conf = requirejs('./configure');

var c9_filepath = process.argv[2];
var c9_filebasename = process.argv[3];
var c9_ip = process.argv[4];
var fn = __filename.slice(__dirname.length + 1, -3);

console.log('<<-------------Starting Remote Debug------------>>');
console.log('['+fn+'] starting debug with the following arguments..');
console.log('['+fn+'] C9 IP:', c9_ip);
console.log('['+fn+'] C9 exec path:', c9_filepath+'/'+c9_filebasename);
console.log('['+fn+'] Target IP:', conf.target.ip);
console.log('['+fn+'] Target username:', conf.target.username);
console.log('['+fn+'] Target password:', conf.target.password);
console.log('['+fn+'] Target exec path:', conf.target.filepath);
console.log('<<----------------------------------------------->>');


process.on("exit", function(code){
    if (code > 0){
        console.log('['+fn+'] error code:', code);
        console.log('['+fn+'] please check values in configure.js and confirm that file path exists on target');
    }
    else
        console.log('['+fn+'] exit successfully! code:', code);
})

var startserver = function(){
    var ssh = new SSH({
        host: conf.target.ip, 
        user: conf.target.username,
        pass: conf.target.password
    });
    
    ssh.on('error', function(){
        console.log('['+fn+'] error: error on ssh');
    });
    ssh.on('ready', function(){
        console.log('['+fn+'] success: ssh connected');
    });
    
    ssh.exec('gdbserver '+c9_ip+':'+conf.gdb_port+' '+c9_filebasename, {
        out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr);
        }
    }).start();
}

client.scp(c9_filepath+'/'+c9_filebasename, {
    host: conf.target.ip,
    username: conf.target.username,
    password: conf.target.password,
    path: conf.target.filepath
}, function(err) {
    if (err){
        console.log('['+fn+'] error: when copying file over to target:', err);
    } 
    else {
        console.log('['+fn+'] success: file copied to target'); 
        startserver();
    }
});
