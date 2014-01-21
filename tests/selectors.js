'use strict';

var expect    = require('chai').expect,
    fs        = require('fs'),
    path      = require('path'),
    uncss     = require('./../lib/uncss.js');

/* Read file sync sugar. */
var rfs = function (file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8').toString();
};

var rawcss = false;
var tests = fs.readdirSync(path.join(__dirname, 'selectors/fixtures'));
var input = '';

/* Only read through CSS files */
tests.forEach(function (test, i) {
    if (test.indexOf('.css') > -1) {
        input += rfs('selectors/fixtures/' + test);
    } else {
        tests.splice(i, 1);
    }
});

describe('Selectors', function () {

    before(function (done) {
        uncss(rfs('selectors/index.html'), { csspath: 'tests/selectors' }, function (err, output) {
            if (err) {
                throw err;
            }
            rawcss = output;
            done();
        });
    });

    /* Test that the CSS in the 'unused' folder is not included in the generated
     * CSS
     */
    tests.forEach(function (test) {
        it('Should not output unused ' + test.split('.')[0], function () {
            expect(rawcss).to.not.include.string(rfs('selectors/unused/' + test));
        });
    });

    /* Test that the CSS in the 'expected' folder is included in the generated
     * CSS
     */
    tests.forEach(function (test) {
        it('Should output expected ' + test.split('.')[0], function () {
            expect(rawcss).to.include.string(rfs('selectors/expected/' + test));
        });
    });
});