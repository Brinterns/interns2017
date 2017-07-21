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
        client.collection('users').insertOne({cloakid: id, wins:0, loses: 0}, function(err, thing) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                })
            } else {
                console.log("added user with id = " + id);
                resolve(thing.insertedId);
            }
        })
    })
}

module.exports.add = add;

module.exports.find = function(id) {
    return new Promise(function(resolve, reject) {
        client.collection('users').findOne({
            cloakid: id
        }, function(err, idOut) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                })
            } else if (idOut === null) {
                add(id);
            } else {
                console.log("Found user with id = " + id);
                resolve(idOut);
            }
        })
    })
}

module.exports.update = function(id, win, loss) {
    return new Promise(function(resolve, reject) {
        client.collection('users').update({
            cloakid: id
        },{
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
                console.log("Updated win loss record of user with id = " + id);
                resolve(out);
            }
        })
    })
}








module.exports.collection = function(collection) {
    return client.collection(collection);
}
