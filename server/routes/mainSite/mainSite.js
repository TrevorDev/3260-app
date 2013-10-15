var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

exports.showMainPage = function(req, res, next) {

    view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.render = function(req, res, next, file) {
    fs.exists(process.cwd() + '/views/' + file + '.ejs', function(exists) {
        if (exists) {
            res.render(file, res.template);
        } else {
            next();
        }
    });
};