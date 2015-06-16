# accountdown-basic

username/password authentication for
[accountdown](https://npmjs.org/package/accountdown)
using salted hashes

[![build status](https://secure.travis-ci.org/substack/accountdown-basic.png)](http://travis-ci.org/substack/accountdown-basic)

# example

## create an account

```js
var accountdown = require('accountdown');
var level = require('level');
var db = level('/tmp/users.db');

var users = accountdown(db, {
    login: { basic: require('accountdown-basic') }
});

var user = process.argv[2];
var pass = process.argv[3];
var bio = process.argv[4];

var opts = {
    login: { basic: { username: user, password: pass } },
    value: { bio: bio }
};
users.create(user, opts, function (err) {
    if (err) console.error(err);
});
```

## verify credentials

```
var accountdown = require('accountdown');
var level = require('level');
var db = level('/tmp/users.db');

var users = accountdown(db, {
    login: { basic: require('accountdown-basic') }
});

var creds = {
    username: process.argv[2],
    password: process.argv[3]
};
users.verify('basic', creds, function (err, ok) {
    if (err) console.error(err)
    else console.log('verified:', ok)
});
```

With these two programs, we can create an account and then verify the
user/pass:

```
$ node example/create.js substack beepboop 'oh hello'
$ node example/verify.js substack beepboop
verified: true
$ node example/verify.js substack bleep
verified: false
```

## updating the password

```
var accountdown = require('accountdown');
var level = require('level');
var db = level('/tmp/users.db');

var users = accountdown(db, {
    login: { basic: require('accountdown-basic') }
});

var newCreds = {
    login: { basic: { username: user, password: newPassword } }
};

users.update(user, newCreds, function (err) {
    if (err) console.error(err)
});
```


## without accountdown

Modules should be written to be useful on their own where possible.
You can use this module without accountdown too:

```js
var level = require('level');
var db = level('/tmp/users.db', {
    keyEncoding: require('bytewise'),
    valueEncoding: 'json'
});
var basic = require('../');
var batch = require('level-create-batch');

var b = basic(opts, [ 'login', 'basic' ]);

var user = process.argv[2];
var pass = process.argv[3];

var creds = { username: user, password: pass };
batch(db, b.create(user, creds));
```

and to change the account's password, continuing off the previous example:

```
var newPass = process.argv[4];

var newCreds = { username: user, password: newPass };
b.update(user, newCreds, function (err, updatedLoginRow) {
    if (err) console.error(err)
    batch(db, updatedLoginRow, function (err) {
        if (err) console.error(err)
    });
}
```


# methods

```js
var basic = require('accountdown-basic')
```

## var b = basic(db, prefix, opts)

Return a basic auth instance `b` given a database handle `db` and an array
prefix `prefix`.

Optionally set an `opts.key` to use a different key as the identity than
`username`.

## b.create(id, creds)

Create a new login for the account identified by `id` with `creds`, an object
with `username` and `password` properties.

Return an array of rows that can be fed into
[level-create-batch](https://npmjs.org/package/level-create-batch).

## b.verify(creds, cb)

Verify `creds`, a username with `username` and `password` properties.

`cb(err, success, id)` fires with any errors or a boolean `success` and the
account identifier `id`.

## b.update(id, creds, cb)

Update `creds`, where `username` is an existing username and `password` is a new password for that username.

`cb(err, rows)` fires with any errors, and an array `rows` containing a single row that can be fed into
[level-create-batch](https://npmjs.org/package/level-create-batch) using the row's `put` type.

# install

With [npm](https://npmjs.org/package/npm) do:

```
npm install accountdown-basic
```

# license

MIT
