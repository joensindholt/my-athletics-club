module.exports = function () {

    var _ = require('lodash');
    var argv = require('yargs').argv;
    var Table = require('cli-table');

    
    var settingsKey = argv.settings || 'default';
    var settings = require('./../config.' + settingsKey + '.json');
    
    var table = new Table();
    _.forEach(settings, function (k, v) {
        var o = {};
        o[v] = k;
        table.push(o);
    });

    console.log(table.toString());

    return settings;

};
