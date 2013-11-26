var mongoose = require('mongoose');

var database = "maybankdb";
var collections = ['testData', 'participants', 'ihc', 'testparticipants', 'fullist'];
var db = require('mongojs').connect(database, collections);
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.fetchdb = function(req, res){
    
    var allParticipants = [];

        // db.testparticipants.find({PRESENT: 'YES'}, function(err, participant){
        db.testparticipants.find({$and: [{PRESENT: 'YES'}, {COMPANYNAME: {$not: new RegExp('maybank', 'i')} }]}, function(err, participant){
        // db.finallist.find({}, function(err, participant){ 
            participant.forEach(function(member,index){
                allParticipants[index] = {firstname: member.FIRSTNAME, lastname: member.LASTNAME, companyname: member.COMPANYNAME};
                });
            res.send((participant));
        });    
};