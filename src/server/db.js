var config = require('./config');
var mongo = require('mongodb');
var Promise = require("promise")

var MongoClient = mongo.MongoClient, format = require('util').format;
var client;
const dbUri  = 'mongodb://' + config.mongoUsr + ':' + config.mongoPsswd + config.mongoAdd;
MongoClient.connect(dbUri, function(err, db) {
    console.log("Connecting to DB client on: ", dbUri);
    if (err) {
        console.log("Failed to connect to db on: ", dbUri, err);
        return;
    }
    client = db;
    console.log("DB client connected at: " + dbUri);
});

var add = function(id) {
    return new Promise(function(resolve, reject) {
        client.collection('users').insertOne({cloakid: id, wins:0, loses: 0}, function(err, user) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                });
            } else {
                resolve({wins: user.wins, loses: user.loses});
            }
        })
    })
}

module.exports.add = add;

module.exports.find = function(id) {
    return new Promise(function(resolve, reject) {
        client.collection('users').findOne({
            cloakid: id
        }, function(err, user) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                });
            } else if (user === null) {
                add(id);
            } else {
                resolve({wins: user.wins, loses: user.loses});
            }
        });
    });
}

module.exports.update = function(id, win, loss) {
    return new Promise(function(resolve, reject) {
        client.collection('users').update({
            cloakid: id
        },{
            cloakid: id,
            wins: win,
            loses: loss
        }, function(err, out) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                })
            } else if (out === null) {
                add(id);
            } else {
                resolve(out);
            }
        })
    })
}

module.exports.collection = function(collection) {
    return client.collection(collection);
}
