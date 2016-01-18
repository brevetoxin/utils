'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var infile = "players.csv";
var outfile = "players.json";
fs.readFileAsync(infile, 'utf-8')
.then(function (data) {
  var players = data.split('\n');
  players.shift();
  return players;
})
.then (function (players) {
  players = players.map(function (player) {
    return player.split(',');
  })
  return players;
})
.then (function (players) {
  var parsedPlayers = [];
  players.forEach (function (player) {
    var playerName = player[1].split(' ', 2);
    var playerJson = {
      firstName: playerName[0],
      lastName: playerName[1],
      providerId: player[0],
      position: player[2],
      salary: player[7],
      value: player[8].replace('\r', '')
    }
    parsedPlayers.push(playerJson)
  })
  return parsedPlayers;
})
.then (function (players) {
  return {
    rules: {
      salaryCap: 35000,
      positions: [
        { 'P': 1 },
        { 'C': 1 },
        { '1B': 1 },
        { '2B': 1 },
        { 'SS': 1 },
        { '3B': 1 },
        { 'OF': 3 }
      ]
    },
    players: players
  }
})
.then (function (data) {
  return fs.writeFileAsync(outfile, JSON.stringify(data));
})
.catch(function (err) {
  console.log(err);
})
