var config = require('./config');
var mongo = require('mongodb');
var Promise = require("promise");

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

var add = function(id, name) {
    return new Promise(function(resolve, reject) {
        client.collection('users').insertOne({
            cloakid: id,
            name: name,
            wins:0,
            loses: 0,
            elorank: 1200,
            avatar: null
        }, function(err, user) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                });
            } else {
                resolve(user);
            }
        });
    });
}

module.exports.add = add;

module.exports.getAllUsers = function() {
    if (!client) {
        return null;
    }
    return client.collection('users').find();
}

module.exports.find = function(id, name) {
    return new Promise(function(resolve, reject) {
        client.collection('users').findOne({
            cloakid: id
        }, function(err, user) {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                });
            } else {
                resolve(user);
            }
        });
    });
}

module.exports.update = function(userData, name) {
    return new Promise(function(resolve, reject) {
        client.collection('users').update({
            cloakid: userData.dbId
        },{
             $set: {
                 name: name,
                 wins: userData.winLossRecord.wins,
                 loses: userData.winLossRecord.loses,
                 elorank: userData.elorank
             }
        }, function(err, out) {
             if (err) {
                reject({
                    code: 500,
                    msg: err
                })
            }  else {
                resolve(out);
            }
        })
    })
}

module.exports.updateAvatar = function(userData, avatar) {
    return new Promise(function(resolve, reject) {
        client.collection('users').update({
            cloakid: userData.dbId
        },{
             $set: {
                 avatar: avatar
             }
        }, function(err, out) {
             if (err) {
                reject({
                    code: 500,
                    msg: err
                })
            }  else {
                resolve(out);
            }
        });
    });
}

module.exports.collection = function(collection) {
    return client.collection(collection);
}
