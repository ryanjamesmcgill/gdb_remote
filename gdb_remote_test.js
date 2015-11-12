define(function(require, exports, module) {
    main.consumes = ["plugin.test", "gdb_remote"];
    main.provides = [];
    return main;

    function main(options, imports, register) {
        var test = imports["plugin.test"];
        var myplugin = imports.myplugin;

        var describe = test.describe;
        var it = test.it;
        var assert = test.assert;

        describe(myplugin.name, function(){
            // Your test here
        });

        register(null, {});
    }
});