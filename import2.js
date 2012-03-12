var fs = require('fs');

var mysql = require('mysql');
var client = mysql.createClient({
  user: 'root',
  password: 'juX2p0mX',
});

client.query('USE meet');


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
            data = [
                'f',
                '/images/pictures/women/' + femalePics[i],
                lastNames[i],
                'password',
                'France',
                'Paris',
                'fakeuser@meet.com',
                '75000',
                '25',
                '35'
            ];
        } else {
            data = [
                'm',
                '/images/pictures/men/' + malePics[i],
                lastNames[i],
                'password',
                'France',
                'Paris',
                'fakeuser@meet.com',
                '75000',
                '25',
                '35'
            ];
        }

        fakeData.push(data);

    }
}

function saveFakeData() {
    var user;
    for (var i = 0, l = fakeData.length; i < l; i++) {
        client.query(
            'INSERT INTO users '+
            'SET gender = ?, pic = ?, login = ?, password = ?, country = ?, city = ?, email = ?, zipcode = ?, range1 = ?, range2 = ?',
            fakeData[i]
        );
    }
}

function dumpSchema() {
    client.query(
        'SELECT * FROM users',
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            console.log(results);
            console.log(fields);
            client.end();
        }
    );
    // User.find({}, function (err, docs) {
    //     console.log("users", err, docs);
    // });
}

function truncateSchema() {
    // User.find({}, function (err, docs) {
    //     docs.forEach(function(record) {
    //         record.remove();
    //     });
    // });
}

dumpSchema();
// truncateSchema();

loadPics();
loadNames();
buildFakeData();
saveFakeData();
console.log("length", lastNames.length, maleNames.length, femaleNames.length, malePics.length, femalePics.length, fakeData.length/*, fakeData*/);
