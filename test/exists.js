var accountdown = require('accountdown');
var test = require('tape');
var level = require('level-test')();
var db = level('exists-' + Math.random());

test('exists', function (t) {
    t.plan(5);
    
    var users = accountdown(db, {
        login: { basic: require('../') }
    });
    var opts = {
        login: { basic: { username: 'substack', password: 'beep boop' } },
        value: { bio: 'beep boop' }
    };
    users.create('substack', opts, function (err) {
        t.ifError(err);
        
        users.get('substack', function (err, row) {
            t.ifError(err);
            t.deepEqual(row, { bio: 'beep boop' });
            
            users.create('substack', opts, function (err) {
                t.equal(err.code, 'EXISTS');
            });
        });
    });
    
    users.create('substack', opts, function (err) {
        t.equal(err.code, 'LOCKED');
    });
});
