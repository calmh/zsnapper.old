var fs = require('fs');
var ini = require('ini');

module.exports = function (name) {
    var data = fs.readFileSync(name, 'utf-8');
    var rawConf = ini.parse(data);
    var jobs = [];
    Object.keys(rawConf.schedule).forEach(function (schedName) {
        var job = rawConf.schedule[schedName];
        var datasets = [];
        job.dataset.forEach(function (dsName) {
            datasets = datasets.concat(rawConf.datasets[dsName].match);
        });
        job.dataset = datasets;
        job.tag = schedName;
        jobs.push(job);
    });
    return jobs;
}

