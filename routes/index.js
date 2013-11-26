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
        db.testparticipants.find({$and: [{PRESENT: 'YES', winner: {$ne: true}}, {COMPANYNAME: {$not: new RegExp('maybank', 'i')} }]}, function(err, participant){
        // db.finallist.find({}, function(err, participant){ 
            participant.forEach(function(member,index){
                allParticipants[index] = {firstname: member.FIRSTNAME, lastname: member.LASTNAME, companyname: member.COMPANYNAME};
                });
            res.send((participant));
        });    
};


exports.markAsWinner = function(email, callback){
    var d = new Date();
    db.testparticipants.update({'EMAILADDRESS':email}, {$set:{winner:true, timeWon:d}}, callback  )

}

exports.fetchWinners = function(callback){
    db.testparticipants.find({winner: true}).sort({timeWon:1}, callback);
}

exports.clearWinners = function(callback){
    db.testparticipants.update({_id: {$ne:null }}, {$set:{winner:false, timeWon:null}}, {multi:true}, callback  )    
}