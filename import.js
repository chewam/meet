var fs = require('fs'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/app');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
    gender: String,
    email: String,
    country: String,
    pic: String,
    login: String,
    password: String
}));

var lastNames, maleNames, femaleNames, malePics, femalePics, fakeData = [];

function loadNames() {
    var data = fs.readFileSync('./data/FirstNames-Female.txt', 'ascii');
    femaleNames = data.toString().split('\r\n');
    data = fs.readFileSync('./data/FirstNames-Male.txt', 'ascii');
    maleNames = data.toString().split('\r\n');
    data = fs.readFileSync('./data/LastNames.txt', 'ascii');
    lastNames = data.toString().split('\r\n');
}

function loadPics() {
    femalePics = fs.readdirSync('./data/pictures/women');
    malePics = fs.readdirSync('./data/pictures/men');
}

function buildFakeData() {
    var data, index, max = 270;

    for (var i = 0; i < max; i++) {
        index = Math.floor(Math.random() * max);

        if (i % 2) {
            data = {
                gender: 'f',
                pic: '/images/pictures/women/' + femalePics[i],
                // firstName: femaleNames[i],
                // lastName: lastNames[i],
                login: lastNames[i],
                password: 'password',
                country: 'France',
                city: 'Paris',
                email: 'fakeuser@meet.com',
                zipcode: '75000',
                range1: '25',
                range2: '35'
            };
        } else {
            data = {
                gender: 'm',
                pic: '/images/pictures/men/' + malePics[i],
                // firstName: maleNames[i],
                // lastName: lastNames[i],
                login: lastNames[i],
                password: 'password',
                country: 'France',
                city: 'Paris',
                email: 'fakeuser@meet.com',
                zipcode: '75000',
                range1: '25',
                range2: '35'
            };
        }

        fakeData.push(data);

    }
}

function saveFakeData() {
    var user;
    for (var i = 0, l = fakeData.length; i < l; i++) {
        user = new User(fakeData[i]);
        user.save();
    }
}

function dumpSchema() {
    User.find({}, function (err, docs) {
        console.log("users", err, docs);
    });
}

function truncateSchema() {
    User.find({}, function (err, docs) {
        docs.forEach(function(record) {
            record.remove();
        });
    });
}

dumpSchema();
// truncateSchema();

loadPics();
loadNames();
buildFakeData();
saveFakeData();
console.log("length", lastNames.length, maleNames.length, femaleNames.length, malePics.length, femalePics.length, fakeData.length/*, fakeData*/);
